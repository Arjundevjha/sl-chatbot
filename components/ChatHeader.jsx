export default function ChatHeader() {
    return (
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <h1 className="text-xl font-semibold">SL Symposium Chatbot</h1>
      </div>
    );
  }