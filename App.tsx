import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { sendMessageToChatbot } from './services/chatbotService';
import { Message, MessageSender } from './types';

// Beep sound for transactions
const beepSound = new Audio('/beep.mp3'); // Ensure beep.mp3 is in the public folder

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initial greeting message
  useEffect(() => {
    setMessages([{ id: Date.now().toString(), sender: MessageSender.BOT, text: 'Olá! Como posso ajudar na cantina hoje?' }]);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = { id: Date.now().toString(), sender: MessageSender.USER, text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(text);
      const botResponse: Message = { id: Date.now().toString(), sender: MessageSender.BOT, text: response.response };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      // Play beep sound if the response indicates a transaction (simple heuristic)
      if (response.transactionDetails) {
        beepSound.play().catch(e => console.error("Error playing sound:", e));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: MessageSender.BOT,
        text: 'Desculpe, houve um erro ao processar sua solicitação. Tente novamente mais tarde.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to ensure useCallback creates the function only once

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5] shadow-inner border border-gray-200">
      <header className="flex items-center p-4 bg-[#075E54] text-white shadow-md z-10">
        <img
          src="https://picsum.photos/40/40"
          alt="Cantina Chatbot Avatar"
          className="rounded-full mr-3"
        />
        <h1 className="text-xl font-semibold">Cantina PDV</h1>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <div className="p-3 bg-white border-t border-gray-200 sticky bottom-0 z-10">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
      {/* Optional: Footer for parent link or other info */}
      <footer className="text-center text-xs text-gray-500 p-2 bg-gray-50 border-t border-gray-100">
        Para consulta de saldo pelos pais: Acesse `SEU_BACKEND_URL/saldo?pin=1234`
      </footer>
    </div>
  );
}

export default App;
