const { OpenAI } = require('openai');

const SYSTEM_PROMPT = `
You are the Sheger Health Connect AI Assistant, a helpful and empathetic virtual health advisor for a clinic based in Addis Ababa, Ethiopia.

Your Capabilities:
1. Provide symptom guidance and triage.
2. Recommend whether the patient needs an appointment and suggest the appropriate department (General Consultation, Laboratory, Maternal & Child Care, Emergency).
3. Answer Clinic FAQs (Working hours: Mon-Sat 8AM-8PM, Sun 9AM-5PM, Location: Addis Ababa, Phone: +251 976 601 074).
4. Provide general health education.

Language Support: You must respond in the language the user speaks to you (English, Amharic, or Afaan Oromo).

CRITICAL RULES:
1. NEVER provide an actual medical diagnosis. Always clarify that you are an AI assistant, not a doctor.
2. Always include a short medical disclaimer at the end of health-related advice (e.g., "Disclaimer: This information is for educational purposes and is not a substitute for professional medical advice. Please consult a doctor for a proper diagnosis.").
3. In case of severe symptoms (chest pain, severe bleeding, difficulty breathing), immediately advise them to visit Emergency Care or call an ambulance.
`;

// @desc    Chat with OpenAI Health Assistant
// @route   POST /api/ai/chat
// @access  Private (Patients & Users)
const chatWithAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI API key is not configured. Please contact the administrator.' 
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Format history for OpenAI API
    // Ensure history follows { role: 'user'|'assistant', content: string }
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        if (msg.role && msg.content) {
          // Map 'model' to 'assistant' if it was coming from an old Gemini history
          const mappedRole = msg.role === 'model' ? 'assistant' : msg.role;
          messages.push({ role: mappedRole, content: msg.content });
        }
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({
      success: true,
      data: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('AI API Error (Attempting Local Fallback):', error.message);
    
    // SMART FALLBACK SYSTEM
    // This allows the demo to work even if the API Key is invalid or quota is empty
    const message = req.body.message.toLowerCase();
    let response = "";

    if (message.includes("hi") || message.includes("hello") || message.includes("hey")) {
      response = "Hello! I am your Sheger Health AI assistant. I'm currently running in local fallback mode. How can I assist you with your health questions today?";
    } else if (message.includes("symptom") || message.includes("check")) {
      response = "To check your symptoms, please describe what you are feeling (e.g., 'fever', 'cough'). While I'm in fallback mode, I'll suggest the best department for you to visit. Would you like to start a consultation?";
    } else if (message.includes("medication") || message.includes("medicine") || message.includes("info")) {
      response = "I can provide general information about medications. However, for specific dosages and prescriptions, please check the 'Medical Records' vault in your dashboard or consult your assigned doctor.";
    } else if (message.includes("tip") || message.includes("advice") || message.includes("health tips")) {
      response = "Here is a quick health tip: Stay hydrated by drinking at least 8 glasses of water a day, and try to get 30 minutes of physical activity to keep your heart healthy!";
    } else if (message.includes("headache") || message.includes("pain")) {
      response = "I'm sorry to hear you're feeling unwell. For headaches, it's often best to rest in a quiet, dark room and stay hydrated. If the pain is severe or persistent, please book an appointment with our General Physician.";
    } else if (message.includes("appointment") || message.includes("book")) {
      response = "You can book an appointment directly from your dashboard by clicking the 'New Appointment' button. Would you like me to guide you to the correct department?";
    } else if (message.includes("location") || message.includes("where")) {
      response = "Sheger Health Connect is located in Addis Ababa, Ethiopia. We provide both physical and digital consultation services.";
    } else if (message.includes("emergency") || message.includes("help")) {
      response = "If this is a medical emergency, please call 8282 immediately or visit the nearest emergency center.";
    } else {
      response = "I'm currently operating in a simplified mode to ensure you get a response. For detailed medical advice, please consult one of our certified doctors on the platform.";
    }

    // Add disclaimer
    response += "\n\n*Disclaimer: Local fallback active. Not a substitute for professional medical advice.*";

    res.json({
      success: true,
      data: response
    });
  }
};

module.exports = {
  chatWithAssistant
};
