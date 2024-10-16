import OpenAI from 'openai';
import { UserProfile } from '@/types/user';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production. Use a backend service instead.
});

export async function generateInsights(context: string, userProfile: UserProfile): Promise<{ insights: string[], suggestions: string[] }> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are an AI assistant for a CRM system. The user's profile is as follows:
          Name: ${userProfile.name}
          Role: ${userProfile.role}
          Company: ${userProfile.company}
          Industry: ${userProfile.industry}
          Product/Service: ${userProfile.product_or_service}
          Location: ${userProfile.location}
          Target Market: ${userProfile.target_market}

          Generate 3 concise, actionable insights based on the provided CRM data context and user profile. Also, provide 2 smart suggestions for reaching out to contacts or companies based on recent industry news or trends, considering the user's profile. Each suggestion should include a brief explanation of the news/trend and a sample message to use as an opener.`
        },
        { role: "user", content: context }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content?.split('\n').filter(Boolean) || [];
    const insights = response.slice(0, 3);
    const suggestions = response.slice(3);

    return { insights, suggestions };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}