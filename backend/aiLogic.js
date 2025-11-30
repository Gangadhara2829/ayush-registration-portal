const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `You are the Ayush Portal AI Assistant. Your role is to provide polite, helpful, and concise answers related to the Ayush Portal registration process for startups. You should reference policies, documents, and application statuses.

If a user asks about their specific application status, documents, or login credentials, you MUST remind them to check their secure dashboard/status page and tell them you cannot access their personal data for security reasons.

Answer general questions about the Ayush sector, required documentation, and general status meanings. Keep responses professional and brief.`;

// Use a supported model name
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",     // or "gemini-2.5-flash"
  systemInstruction,                // set as real system prompt
});

async function getAiResponse(userQuery) {
  if (!process.env.GEMINI_API_KEY) {
    return "The AI assistant is not configured. Please set the GEMINI_API_KEY in the backend .env file.";
  }

  try {
    // Chat session (history optional)
    const chat = model.startChat({
      history: [],
    });

    const result = await chat.sendMessage(userQuery);
    const response = result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "I'm sorry, I'm experiencing technical difficulties and cannot connect to the AI right now. Please try again later.";
  }
}

module.exports = { getAiResponse };
