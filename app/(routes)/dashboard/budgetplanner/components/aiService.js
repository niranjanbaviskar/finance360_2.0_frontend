import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Gemini AI Initialization ---
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
let genAI;
let model;


// --- CHANGE THIS AS NEEDED ---
// const STABLE_MODEL_NAME = "gemini-2.5-pro";
// const STABLE_MODEL_NAME = "gemini-1.5-flash-latest";
const STABLE_MODEL_NAME = "gemini-2.0-flash";

// Conditionally initialize AI if API key exists
if (apiKey) {
  try {
    console.log(`Initializing GoogleGenerativeAI with model: ${STABLE_MODEL_NAME}`);
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: STABLE_MODEL_NAME,
    });
  } catch (error) {
    console.error(`Failed to initialize GoogleGenerativeAI with model ${STABLE_MODEL_NAME}:`, error);
    genAI = undefined;
    model = undefined;
  }
} else {
  console.warn("NEXT_GEMINI_API_KEY not found in environment variables.");
}

// --- Generation Configuration ---
const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

const generateBudgetReport = async (prompt) => {
    if (!model) {
        throw new Error(`AI Model (${STABLE_MODEL_NAME}) is not initialized.`);
    }

    try {
        console.log(`Sending request to model: ${model.model}`);

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        const response = result.response;

        if (!response) {
            console.error("API Response was undefined or null", result);
            throw new Error("Received no response from the AI model. Check network or API status.");
        }

        if (response.promptFeedback?.blockReason) {
            console.warn("Prompt blocked by safety settings:", response.promptFeedback);
            throw new Error(`Request blocked due to safety filters: ${response.promptFeedback.blockReason}. Please adjust your input.`);
        }
        if (!response.candidates || response.candidates.length === 0 || response.candidates[0].content?.parts.length === 0) {
            if (response.candidates?.[0]?.finishReason && response.candidates[0].finishReason !== 'STOP') {
                console.warn("Candidate generation finished unexpectedly:", response.candidates[0].finishReason, response.candidates[0].safetyRatings);
                throw new Error(`AI generation failed. Reason: ${response.candidates[0].finishReason}. Check safety ratings or input length.`);
            } else {
                console.error("API Response structure invalid or empty content:", response);
                throw new Error("Received an empty or invalid response from the AI model.");
            }
        }

        return response.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error in generateBudgetReport:', error);
        throw error; // Re-throw to handle error in the component
    }
};


const isAIModelInitialized = () => {
    return !!model;
};

const getAIModelName = () => {
    return STABLE_MODEL_NAME;
}

export { generateBudgetReport, isAIModelInitialized, getAIModelName, apiKey };