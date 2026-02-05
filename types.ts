// types.ts

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp?: Date;
}

export interface ChatbotResponse {
  response: string;
  transactionDetails?: {
    type: 'sale' | 'recharge' | 'registration';
    studentName?: string;
    amount?: number;
    product?: string;
    paymentMethod?: 'Pix' | 'Dinheiro' | 'Fiado';
    newBalance?: number;
  };
  reportData?: {
    totalSales: number;
    productSummary: { [key: string]: number };
  };
  parentInfo?: {
    name: string;
    grade: string;
    balance: number;
    transactions: { date: string; product: string; total: number; payment: string }[];
  }[];
}
