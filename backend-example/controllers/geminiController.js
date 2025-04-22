
const { TextServiceClient } = require("@google/generative-ai");

const genAI = new TextServiceClient({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyD_F_lFo3XjC_bYE2yhjpVM7r-7tCqCbWw"
});

const generateFlashcardContent = async (text, title) => {
  try {
    const prompt = `Create a concise educational flashcard summary from the following text. Format it in a clear, structured way that's easy to understand. Focus on key concepts and main points. Title: ${title}\n\nText: ${text}`;

    const result = await genAI.generateText({
      prompt: {
        text: prompt
      },
      temperature: 0.7,
      maxOutputTokens: 800,
    });

    const summary = result.response.text;
    return summary;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate flashcard content');
  }
};

module.exports = {
  generateFlashcardContent
};
