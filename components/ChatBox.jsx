import { useRef, useEffect } from 'react';

 export default function ChatBox({ messages }) {
   const chatboxRef = useRef(null);

   useEffect(() => {
     if (chatboxRef.current) {
       chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
     }
   }, [messages]);

   return (
     <div id="chatbox" ref={chatboxRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
       {messages.map((message, index) => (
         <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
           <div className={`p-3 rounded-lg max-w-xs lg:max-w-md shadow ${message.sender === 'You' ? 'bg-green-100 text-gray-800' : 'bg-blue-100 text-gray-800'} ${message.sender === 'Error' ? 'bg-red-100' : ''}`}>
             <p className={`text-sm font-medium mb-1 ${message.sender === 'You' ? 'text-green-700' : 'text-blue-700'} ${message.sender === 'Error' ? 'text-red-700' : ''}`}>{message.sender}</p>
             <p>{message.text}</p>
           </div>
         </div>
       ))}
     </div>
   );
 }