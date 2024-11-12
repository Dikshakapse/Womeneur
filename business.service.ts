import { OpenAI } from 'openai'; // Updated import for newer OpenAI SDK
import { Business } from '../models/Business';

export class BusinessService {
  private static openai: OpenAI;

  // Initialize OpenAI API client
  static {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("API Key for OpenAI is missing");
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  // Generate business plan using OpenAI's chat completion API
  static async generateBusinessPlan(businessData: any) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a business plan expert."
          },
          {
            role: "user",
            content: 'Create a detailed business plan for: ${JSON.stringify(businessData)}'
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating business plan:', error);
      throw new Error('Failed to generate business plan');
    }
  }

  // Calculate financials for the business
  static async calculateFinancials(business: {
    projectedRevenue: number;
    monthlyExpenses: number;
    initialInvestment: number;
  }) {
    try {
      // Financial calculations
      const monthlyRevenue = business.projectedRevenue / 12;
      const monthlyProfit = monthlyRevenue - business.monthlyExpenses;
      const breakEvenMonths = business.initialInvestment / monthlyProfit;

      return {
        monthlyRevenue,
        monthlyProfit,
        breakEvenMonths,
        yearlyProjections: Array.from({ length: 5 }, (_, i) => ({
          year: i + 1,
          revenue: monthlyRevenue * 12 * Math.pow(1.1, i), // 10% growth in revenue each year
          expenses: business.monthlyExpenses * 12 * Math.pow(1.05, i) // 5% growth in expenses each year
        }))
      };
    } catch (error) {
      console.error('Error calculating financials:', error);
      throw new Error('Failed to calculate financials');
    }
  }
}