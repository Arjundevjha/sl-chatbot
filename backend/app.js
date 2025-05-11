const express = require('../node_modules/express');
const cors = require('../node_modules/cors');
const dotenv = require('../node_modules/dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('../node_modules/@google/generative-ai');

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Global variables
let limitPrompt = 0;
let chatHistory = [];
let idx = 0;

// Event context
function eventContext() {
  return `St. Hilda's Secondary School will host the Biennial Service-Learning (SL) Symposium on 16 March 2025, Friday, from 2:00 PM to 5:30 PM. The theme, **"Building Lives as ONE,"** focuses on unity, service, and leadership in community-building. The event begins with **registration and an environment showcase** at 2:00 PM, followed by the **Welcome Address** by the Principal at 3:00 PM. **Ix Shen**, the keynote speaker, will deliver his address at 3:10 PM, sharing insights from his humanitarian work in Ukraine. After a short break at 4:00 PM, participants will attend **one of four workshops** from 4:15 PM to 5:15 PM, with the symposium concluding with an **After-Action Review (AAR) and reflection** session. Ix Shen, a former Singaporean actor, gained recognition for his first-hand accounts of the **Russia-Ukraine war** while residing in Kyiv. He actively participated in **humanitarian aid efforts** and later published a memoir, *Impressions of an Invasion: A Correspondent in Ukraine* (2023). He also founded a **non-profit organization** to provide financial and medical aid to Ukrainian hospitals. His experiences offer valuable lessons on **resilience and community-building**, relevant to Singapore's **SG60 celebrations**. The symposium features **four concurrent workshops**, each designed to enhance participants' understanding of community engagement and sustainability. The first workshop, **"Beyond the Classroom: Cultivating Eco-Stewards Through Hands-On Learning and Service,"** is led by **St. Andrew's Secondary School**. It highlights their **Eco-Stewardship Programme (ESP)**, which promotes environmental responsibility through **curriculum, culture, community, and campus initiatives**. It explores how **Values-in-Action (VIA)** integrates eco-stewardship into student activities, including **litter-picking, upcycling, and digital tools** like Google Lens and Padlet. Participants will also learn about **student-led environmental initiatives** such as the **Ang Pow Collection Drive** and **Project Eco Runway**. The second workshop, **"Reconnecting Youth to Nature,"** hosted by **Good Earth School**, focuses on reducing the negative effects of **digital overuse** by engaging students in **nature-based learning**. **Dr. Cynthia Wong** will discuss strategies to integrate nature into school curricula, aligning with **Singapore's Green Plan 2030**. Participants will explore **hands-on interventions** that promote environmental awareness, sustainability, and outdoor education. The third workshop, **"From Sympathy to Empathy: Facilitating Transformation for Students into Future Community Builders,"** is led by **Eugene Chua from SG Cares Volunteer Centre**. It examines how **VIA projects** shape students mindset from **sympathy to deep-rooted empathy**. The session emphasizes empowering students to take **ownership of community initiatives**, fostering **long-term engagement and social responsibility**. The fourth workshop, **"From Ideas to Impact – Deep Diving into VIA,"** led by **Kelda Chua from Care Community Services Society**, introduces the **IPARD framework** for developing impactful VIA projects. Through **experiential learning and gamification**, participants will learn how to **identify community needs, create structured plans, and implement sustainable initiatives**. Alongside the workshops, the **Environment Showcase** will highlight sustainability efforts. Participants can engage in **plastic recycling with Semula Asia, urban and beach cleanups with Terra Academy, biodiversity education with The Good Earth School, and food security initiatives with Greenairy**. Attendees are encouraged to **bring plastic bottle caps** for recycling and redeem a **carabiner made from the recycled caps**. The symposium provides students and educators with an **enriching platform for collaboration, reflection, and action** in service-learning, environmental sustainability, and community engagement.`;
}

// Check for vulgarities
function containsVulgarities(prompt) {
  const vulgarities = [
    "FUCK", "SHIT", "ASSHOLE", "BITCH", "CUNT", "PISS", "MOTHERFUCKER",
    "COCK", "BASTARD", "DICKHEAD", "JACKASS", "TWAT", "FAGGOT", "ARSE", "SLUT", "NIGGER", "NIGGA"
  ];
  return vulgarities.some(word => prompt.toUpperCase().includes(word));
}

// Response generation
async function responseGen(prompt) {
  try {
    if (idx === 0) {
      const evtCont = eventContext();
      chatHistory.push({ role: 'user', parts: [{ text: evtCont }] });
      idx = 1;
    }

    chatHistory.push({ role: 'user', parts: [{ text: prompt }] });

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(part => part.text)
      }))
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const responseText = response.text();

    chatHistory.push({ role: 'model', parts: [{ text: responseText }] });
    return responseText;
  } catch (error) {
    console.error('Error in response generation:', error);
    if (error.message.includes('API key')) {
      return 'Error: Invalid or missing API key. Please check your configuration.';
    } else if (error.message.includes('quota')) {
      return 'Error: API quota exceeded. Please try again later.';
    } else {
      return `Error generating response: ${error.message}`;
    }
  }
}

// Process endpoint
app.post('/process', async (req, res) => {
  if (limitPrompt >= 6) {
    return res.status(400).json({ error: 'You have reached the maximum allowed prompts.' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }
    
    // Check prompt length
    if (prompt.split(' ').length > 100) {
      return res.status(400).json({ error: 'Your question has exceeded the max word limit' });
    }
    
    // Check for vulgarities
    if (containsVulgarities(prompt)) {
      return res.status(400).json({ error: 'Your question contains inappropriate language. Please enter a clean question.' });
    }
    
    // Generate response
    const response = await responseGen(prompt);
    limitPrompt += 1;
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: `Error processing request: ${error.message}` });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}); 