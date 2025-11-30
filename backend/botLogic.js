// This function receives the user's message (as a string)
// and returns a response (as a string).

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // --- Start of Bot Rules ---

  if (message.includes("hello") || message.includes("hi")) {
    return "Hello! I am the Ayush Portal Bot. How can I help you today?";
  }

  if (message.includes("status") || message.includes("application")) {
    return "To check your application status, please visit the 'Status' page in your dashboard. Your application status is updated there in real-time.";
  }

  if (message.includes("documents") || message.includes("upload")) {
    return "You can upload your Registration Certificate, Founder ID, and any compliance documents during the registration process.";
  }

  if (message.includes("help") || message.includes("support")) {
    return "You can ask me about your application status, required documents, or how to reset your password.";
  }
  
  if (message.includes("password") || message.includes("reset")) {
    return "You can reset your password by clicking the 'Forgot Password' link on the login page.";
  }

  if (message.includes("thanks") || message.includes("thank you")) {
    return "You're welcome! Let me know if you have any other questions.";
  }

  // --- Default Response ---
  // If no other rule matches:
  return "I'm sorry, I don't understand that question. You can ask me about 'status', 'documents', or 'help'.";
}

// Make this function available to other files
module.exports = { getBotResponse };