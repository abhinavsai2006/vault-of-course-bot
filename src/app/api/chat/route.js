import { getSystemPrompt } from '@/lib/prompts';
import knowledgeBase from '@/lib/knowledge-base.json';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const kbString = JSON.stringify(knowledgeBase, null, 2);
    const systemInstruction = getSystemPrompt(kbString);

    if (!process.env.NVIDIA_API_KEY) {
      // Mock response for testing if API key is not set
      const lastMsg = messages[messages.length - 1].content.toLowerCase();
      let mockReply = "I'm a mock AI because NVIDIA_API_KEY is not set. ";
      
      if (lastMsg.includes("human") || lastMsg.includes("payment")) {
        mockReply = "ESCALATE_TO_WHATSAPP: This issue requires our support team to check your details. Please contact us on WhatsApp and our team will assist you.";
      } else if (lastMsg.includes("course")) {
        mockReply = "- Ethical Hacking: 3 months, $299\n- Python for Beginners: 2 months, $199\n- Full Stack Web Development: 6 months, $499";
      } else {
         mockReply += "Please set the API key in .env.local to enable real AI responses.";
      }
      
      return Response.json({ reply: mockReply });
    }

    const formattedMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    const response = await fetch(process.env.NVIDIA_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b',
        messages: formattedMessages,
        temperature: 0.1,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("NVIDIA API Error:", err);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
