import { getSystemPrompt } from '@/lib/prompts';
import knowledgeBase from '@/lib/knowledge-base.json';
import OpenAI from 'openai';

// Initialize the OpenAI SDK pointing to NVIDIA's API
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL,
  });
} catch (error) {
  console.warn("Could not initialize OpenAI client. Are NVIDIA_API_KEY and NVIDIA_BASE_URL set?");
}

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const kbString = JSON.stringify(knowledgeBase, null, 2);
    const systemInstruction = getSystemPrompt(kbString);

    if (!openai || !process.env.NVIDIA_API_KEY) {
      // Mock response for testing if API key is not set
      const lastMsg = messages[messages.length - 1].content.toLowerCase();
      let mockReply = "I'm a mock AI because NVIDIA_API_KEY is not set. ";
      
      if (lastMsg.includes("human") || lastMsg.includes("payment")) {
        mockReply = "ESCALATE_TO_WHATSAPP: This issue requires our support team to check your details. Please contact us on WhatsApp and our team will assist you.";
      } else if (lastMsg.includes("course")) {
        mockReply = "We have courses in Ethical Hacking, Python, and Full Stack Web Development. You can find more here: " + knowledgeBase.pages.courses;
      } else {
         mockReply += "Please set the API key in .env.local to enable real AI responses.";
      }
      
      return Response.json({ reply: mockReply });
    }

    // Format history for OpenAI
    // OpenAI expects an array of messages with role (system/user/assistant) and content.
    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b',
      messages: formattedMessages,
      temperature: 0.1, // Low temperature to prevent hallucination
    });

    const reply = response.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
