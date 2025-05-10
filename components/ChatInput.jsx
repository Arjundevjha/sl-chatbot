import { useState } from 'react';

 export default function ChatInput({ onSendMessage }) {
   const [message, setMessage] = useState('');

   const handleSendMessage = () => {
     if (message.trim()) {
       onSendMessage(message);
       setMessage('');
     }
   };

   return (
     <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg flex items-center space-x-3">
       <input
         type="text"
         value={message}
         onChange={(e) => setMessage(e.target.value)}
         className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
         placeholder="Type your message..."
         onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
       />
       <button
         onClick={handleSendMessage}
         className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center"
       >
         Send
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
           <line x1="22" y1="2" x2="11" y2="13"></line>
           <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
         </svg>
       </button>
     </div>
   );
 }