// src/services/ai.service.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure that your API key is correctly set in your environment variables
});

export class AIService {
  // Generate business ideas based on a description
  static async generateBusinessIdeas(description: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model like "gpt-4"
      messages: [
        {
          role: "system",
          content: "You are a business advisor specialized in helping women entrepreneurs."
        },
        {
          role: "user",
          content: `Generate 3 innovative business ideas based on this description: ${description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Return the generated business ideas
    return response.choices[0]?.message?.content;
  }

  // Analyze the feasibility of a business plan
  static async analyzeFeasibility(businessPlan: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model like "gpt-4"
      messages: [
        {
          role: "system",
          content: "You are a business plan analyst."
        },
        {
          role: "user",
          content: `Analyze this business plan and provide detailed feedback: ${businessPlan}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Return the feedback on the business plan
    return response.choices[0]?.message?.content;
  }
}
