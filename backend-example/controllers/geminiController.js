
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyD_F_lFo3XjC_bYE2yhjpVM7r-7tCqCbWw");

const generateFlashcardContent = async (text, title) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Create a concise educational flashcard summary from the following text. Format it in a clear, structured way that's easy to understand. Focus on key concepts and main points. Title: ${title}\n\nText: ${text}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    return summary;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate flashcard content');
  }
};

module.exports = {
  generateFlashcardContent
};
