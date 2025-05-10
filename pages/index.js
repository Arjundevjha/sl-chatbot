import { useState } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatBox from '../components/ChatBox';
import ChatInput from '../components/ChatInput';

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: 'Chatbot', text: 'Hello! Ask me about the St. Hilda’s Secondary School Biennial Service-Learning (SL) Symposium.' },
  ]);

  const handleSendMessage = async (message) => {
    setMessages((prevMessages) => [...prevMessages, { sender: 'You', text: message }]);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prevMessages) => [...prevMessages, { sender: 'Error', text: data.error || `Server error: ${response.status}` }]);
      } else {
        setMessages((prevMessages) => [...prevMessages, { sender: 'Chatbot', text: data.response }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'Error', text: 'Could not connect to the chatbot service. Please check the backend URL or try again later.' }]);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[80vh]">
        <ChatHeader />
        <ChatBox messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}