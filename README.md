# Cantina Escolar PDV Chatbot (Frontend)

This is a **React frontend application** designed to serve as a Point-of-Sale (PDV) chatbot for a Brazilian school canteen. It features a WhatsApp-like user interface, is mobile-first, and interacts with a backend API to handle all business logic, student data, and Gemini API calls.

**Please Note:** This repository contains only the **frontend code**. A separate backend application (as described in the original request, e.g., using Flask, SQLite, and Gemini API) is required for this frontend to function completely. The backend is responsible for:
- Handling chat logic and interactions with the Gemini API.
- Managing the SQLite database (students, sales).
- Processing transactions, registrations, reports, and parent inquiries.

## Features (Frontend Perspective)

-   **WhatsApp-like UI:** Green theme, chat bubbles, responsive design.
-   **Mobile-First:** Optimized for small screens and progressively enhanced for larger ones.
-   **Chat Interface:** Allows users (canteen staff) to type commands and receive responses from the chatbot.
-   **Transaction Feedback:** Plays a "beep" sound for successful transactions (sales, recharges).
-   **Loading Indicator:** Shows when the chatbot is processing a request.
-   **Parent Consultation Link:** Provides a hint for parents to check balances (requires backend implementation).

## Getting Started (Frontend)

To run this React frontend application, follow these steps:

### Prerequisites

-   Node.js (v18 or higher) and npm (or Yarn/pnpm) installed.
-   **A running backend API.** This frontend expects a backend server to be running and accessible. The default API base URL is `/api`, which Vite's development server can proxy. For production deployment, you'll need to configure your hosting environment (e.g., Vercel) to proxy requests from `/api` to your actual backend URL.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd cantina-pdv-chatbot-frontend
```

### 2. Install dependencies

```bash
npm install
# or yarn install
# or pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api # Replace with your backend API URL if not proxying
```

If your backend is running on `http://localhost:5000` and serves its API under the `/api` path, this setting will work. If you deploy to Vercel and set up rewrites, `VITE_API_BASE_URL` might not be explicitly needed in the frontend build, as the rewrites handle it.

### 4. Run the development server

```bash
npm run dev
# or yarn dev
# or pnpm dev
```

The application will typically open in your browser at `http://localhost:5173`.

### 5. Backend Interaction

While the frontend is running, it will attempt to communicate with your backend API at the configured `VITE_API_BASE_URL/chat`. Ensure your backend is running and configured to handle `POST` requests to `/api/chat`.

#### Expected Backend Endpoint: `/api/chat` (POST)

-   **Request Body:**
    ```json
    {
      "message": "João 5A salgado grande"
    }
    ```
-   **Response Body:**
    ```json
    {
      "response": "Salgado grande adicionado para João 5A. Total: R$10. Qual a forma de pagamento? [Pix][Dinheiro][Fiado]",
      "transactionDetails": {
        "type": "sale",
        "studentName": "João",
        "amount": 10,
        "product": "Salgado grande"
      }
    }
    ```
    (The `transactionDetails` is optional but helps the frontend identify if a beep sound should play.)

## Deployment (Frontend)

This React application can be deployed to static hosting services like Vercel, Netlify, GitHub Pages, etc.

### Vercel Deployment Example

1.  **Create a new project** on Vercel and link it to your GitHub repository.
2.  **Configure Build & Output Settings:**
    -   **Framework Preset:** `Vite` (Vercel usually auto-detects this).
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist`
3.  **Environment Variables:** Add `VITE_API_BASE_URL` if your backend is deployed to a different URL.
4.  **Rewrites/Proxying (Crucial for connecting to backend):**
    If your backend is deployed separately (e.g., as a Flask app on another Vercel project or a different server), you'll need to configure rewrites in your Vercel project's `vercel.json` file (in the *frontend* project) to proxy `/api` requests to your backend.

    Example `vercel.json` for frontend project:
    ```json
    {
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "https://YOUR_FLASK_BACKEND_URL/api/$1"
        }
      ]
    }
    ```
    **Replace `https://YOUR_FLASK_BACKEND_URL` with the actual URL of your deployed Flask backend.**

### Adding the "beep" sound

For the transaction sound to work, ensure you have an `beep.mp3` file in your `public` directory.

## Conceptual Backend (`Flask + SQLite + Gemini API`)

As this repository is frontend-only, here's a conceptual outline of how the backend would function based on the original request:

**Technologies:**
-   **Flask:** Web framework for handling API routes.
-   **SQLite:** Database for `alunos` (students) and `vendas` (sales).
-   **Google Gemini API (2.5 Flash):** For "chat inteligente" and understanding natural language commands.

**Database Schema (Conceptual):**

-   **`alunos` table:**
    -   `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
    -   `nome` (TEXT NOT NULL)
    -   `turma` (TEXT NOT NULL)
    -   `saldo` (REAL DEFAULT 0.0)
    -   `pai_telefone` (TEXT)
    -   `pin` (TEXT UNIQUE) - 4-digit PIN for parent consultation

-   **`vendas` table:**
    -   `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
    -   `aluno_id` (INTEGER, FOREIGN KEY to `alunos.id`)
    -   `data` (TEXT NOT NULL) - timestamp of the sale
    -   `produto` (TEXT NOT NULL)
    -   `total` (REAL NOT NULL)
    -   `pagamento` (TEXT) - 'Pix', 'Dinheiro', 'Fiado'

**Conceptual API Endpoints:**

-   **`/api/chat` (POST):**
    -   Receives user messages (e.g., "João 5A salgado grande").
    -   Uses Gemini API to interpret the intent (sale, registration, balance check, report, recharge).
    -   Interacts with SQLite to perform operations (update `saldo`, insert `vendas`, insert `alunos`).
    -   Maintains Gemini chat memory (e.g., using `chat.sendMessage` with `history`).
    -   Returns a formatted response string and optional `transactionDetails`.

-   **`/saldo?pin=1234` (GET):**
    -   Publicly accessible link for parents.
    -   Authenticates with a 4-digit `pin`.
    -   Retrieves `alunos` associated with the `pin` (family members).
    -   Fetches `vendas` history for those students.
    -   Renders an HTML page showing family balance and transaction extrato.

**Conceptual Chatbot Logic (handled by backend + Gemini):**

1.  **Product Recognition:** Recognizes "salgado gde", "bolo pote", etc., and maps them to fixed prices.
2.  **Student Lookup/Registration:**
    -   `"João 5A salgado grande"`: Looks up "João 5A". If found, proceeds.
    -   `"cadastro Maria 4B pai(11)99999-9999"`: Registers new student, generates unique 4-digit PIN.
3.  **Transaction Processing:** Updates student `saldo`, records `vendas`.
    -   Asks for payment method if not specified: `[Pix][Dinheiro][Fiado]`
4.  **Balance/Credit Limits:**
    -   **Daily Fiado Limit:** R$15
    -   **Monthly Fiado Limit:** R$300
    -   Alerts when limits are approached or exceeded.
    -   Alerts on low balance for cash/Pix payments.
5.  **Recharge:** `"recarga João R$20"`: Updates `saldo`.
6.  **Reports:** `"relatorio dia"`: Queries `vendas` for daily/monthly summaries.

**Security:**
-   **Parent PIN:** 4-digit PIN for parent balance consultation.
-   **SQLite Backup:** The backend `README.md` (if generated) should include instructions for automatic SQLite database backups.

**Testing (Conceptual commands for the chatbot):**

-   `João 5A salgado grande`
-   `João 5A fiado` (after a sale, if payment not specified)
-   `cadastro Maria 4B pai(11)99999-9999`
-   `recarga Maria R$50 Pix`
-   `saldo João`
-   `relatorio dia`
-   `relatorio mes`
-   `limite fiado João`

This frontend provides the user interface for interacting with such a powerful, Gemini-powered backend system.
