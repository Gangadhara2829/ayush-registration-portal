// backend/aiLogic.js
// Simple offline AYUSH Portal help bot (no Gemini, no API key needed)

// You can tweak these replies anytime.
const systemIntro =
  "I am the AYUSH Startup Registration Portal helper bot. I give short, simple answers related to this portal only.";

async function getAiResponse(userQuery) {
  if (!userQuery || !userQuery.trim()) {
    return "Please type your question about the AYUSH Startup Registration Portal.";
  }

  const msg = userQuery.toLowerCase();

  // Basic intent detection
  if (msg.includes("register") || msg.includes("signup") || msg.includes("sign up")) {
    return (
      systemIntro +
      " To register your startup, click on 'Register as a Startup' on the home page, fill all required details, and upload your documents. After submission, you can track status from your dashboard."
    );
  }

  if (msg.includes("login") || msg.includes("log in")) {
    return (
      systemIntro +
      " To log in, use your registered email and password on the Login page. If you used Google sign-in, click the Google button. For problems, use the 'Forget Password?' option."
    );
  }

  if (msg.includes("forget password") || msg.includes("forgot password") || msg.includes("reset password")) {
    return (
      systemIntro +
      " If you forgot your password, click on 'Forget Password?' on the login page and follow the instructions sent to your email."
    );
  }

  if (msg.includes("status") || msg.includes("track") || msg.includes("application")) {
    return (
      systemIntro +
      " You can check your application status from the Dashboard → Status page after logging in. For security reasons I cannot see your personal application details."
    );
  }

  if (msg.includes("documents") || msg.includes("docs") || msg.includes("certificate") || msg.includes("upload")) {
    return (
      systemIntro +
      " Typically you must upload: registration certificate, founder ID proof, and compliance documents. Please check the registration form for the exact list required for your startup."
    );
  }

  if (msg.includes("approved") || msg.includes("rejected") || msg.includes("verified") || msg.includes("accepted")) {
    return (
      systemIntro +
      " Status meanings:\n" +
      "- Verified: documents checked and found valid.\n" +
      "- Accepted: application is accepted for further processing.\n" +
      "- Approved: final approval is granted.\n" +
      "- Rejected: application did not meet the criteria; please review the remarks if provided."
    );
  }

  if (msg.includes("contact") || msg.includes("help") || msg.includes("support")) {
    return (
      systemIntro +
      " For detailed support, please contact the official AYUSH support team mentioned on the portal or your institute coordinator. I can only give general guidance."
    );
  }

  // Default generic answer
  return (
    systemIntro +
    " I can answer basic questions about registration, login, documents, and application status. " +
    "Please ask something specific, like 'How do I register my startup?' or 'How can I check my application status?'."
  );
}

module.exports = { getAiResponse };
