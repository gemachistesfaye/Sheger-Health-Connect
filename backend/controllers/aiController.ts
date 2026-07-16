import { Request, Response } from 'express';
const { OpenAI } = require('openai');
const { logger } = require('../utils/logger');

const SYSTEM_PROMPT = `
You are the ShegerHealth AI Assistant, a helpful and empathetic virtual health advisor for a clinic based in Addis Ababa, Ethiopia.

Your Capabilities:
1. Provide symptom guidance and triage.
2. Recommend whether the patient needs an appointment and suggest the appropriate department (General Consultation, Laboratory, Maternal & Child Care, Emergency).
3. Answer Clinic FAQs (Working hours: Mon-Sat 8AM-8PM, Sun 9AM-5PM, Location: Addis Ababa, Phone: +251 976 601 074).
4. Provide general health education.

Language Support: You must respond in the language the user speaks to you (English, Amharic, or Afaan Oromo).

CRITICAL RULES:
1. NEVER provide an actual medical diagnosis. Always clarify that you are an AI assistant, not a doctor.
2. Always include a short medical disclaimer at the end of health-related advice.
3. In case of severe symptoms (chest pain, severe bleeding, difficulty breathing), immediately advise them to visit Emergency Care or call an ambulance.
`;

const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(500).json({ success: false, message: 'OpenAI API key is not configured. Please contact the administrator.' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        if (msg.role && msg.content) {
          messages.push({ role: msg.role === 'model' ? 'assistant' : msg.role, content: msg.content });
        }
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '500', 10),
    });

    res.json({ success: true, data: completion.choices[0].message.content });
  } catch (error) {
    logger.error({ error: error.message }, 'AI API Error - Using local fallback');

    const msg = req.body.message.toLowerCase();
    let response = '';

    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      response = 'Hello! I am your ShegerHealth AI assistant. How can I assist you with your health questions today?';
    } else if (msg.includes('symptom') || msg.includes('check')) {
      response = 'To check your symptoms, please describe what you are feeling. Would you like to start a consultation?';
    } else if (msg.includes('medication') || msg.includes('medicine')) {
      response = 'I can provide general information about medications. However, for specific dosages, please consult your assigned doctor.';
    } else if (msg.includes('tip') || msg.includes('advice') || msg.includes('health tips')) {
      response = 'Stay hydrated by drinking at least 8 glasses of water a day, and try to get 30 minutes of physical activity to keep your heart healthy!';
    } else if (msg.includes('headache') || msg.includes('pain')) {
      response = 'For headaches, rest in a quiet, dark room and stay hydrated. If severe or persistent, please book an appointment.';
    } else if (msg.includes('appointment') || msg.includes('book')) {
      response = 'You can book an appointment from your dashboard by clicking the "New Appointment" button.';
    } else if (msg.includes('location') || msg.includes('where')) {
      response = 'ShegerHealth is located in Addis Ababa, Ethiopia.';
    } else if (msg.includes('emergency') || msg.includes('help')) {
      response = 'If this is a medical emergency, please call 8282 immediately or visit the nearest emergency center.';
    } else {
      response = 'I am currently operating in a simplified mode. For detailed medical advice, please consult one of our certified doctors.';
    }

    response += '\n\n*Disclaimer: Local fallback active. Not a substitute for professional medical advice.*';
    res.json({ success: true, data: response });
  }
};

module.exports = { chatWithAssistant };
