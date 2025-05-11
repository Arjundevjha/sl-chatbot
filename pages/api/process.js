export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { prompt } = req.body;
  const backendUrl = 'http://0.0.0.0:5000/process';

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle different error formats from the backend
      if (data.error) {
        return res.status(response.status).json({ error: data.error });
      } else if (data.prompt && typeof data.prompt === 'string') {
        return res.status(response.status).json({ error: data.prompt });
      } else {
        return res.status(response.status).json({ error: `Server error: ${response.status}` });
      }
    }

    // Check if the response has the expected format
    if (!data.response) {
      return res.status(500).json({ error: 'Invalid response format from server' });
    }

    res.status(200).json({ response: data.response });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}