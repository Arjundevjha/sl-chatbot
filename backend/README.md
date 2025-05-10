# SL Chatbot Backend

This is the backend for the SL Chatbot application. It's built with Node.js and Express, using Google's Gemini API for AI responses.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### POST /process

Process a prompt and return a response.

Request body:
```json
{
  "prompt": "Your question here"
}
```

Response:
```json
{
  "response": "AI generated response"
}
```

Error response:
```json
{
  "error": "Error message"
}
``` 