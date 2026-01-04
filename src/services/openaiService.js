import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

console.log('API Key status:', API_KEY ? '✓ Found' : '✗ Missing');

let openai = null;

if (API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true
    });
    console.log('✓ OpenAI initialized');
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI:', error);
  }
} else {
  console.error('❌ VITE_OPENAI_API_KEY not found in .env.local');
}

export async function categorizeExpense(description) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: [
        {
          role: 'system',
          content: 'You are a expense categorization assistant. Reply with ONLY the category name, nothing else.'
        },
        {
          role: 'user',
          content: `Categorize this expense into ONE category: Food, Transport, Entertainment, Shopping, Bills, or Other.

Expense: "${description}"

Reply with ONLY the category name, nothing else.`
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const category = completion.choices[0].message.content.trim();
    
    const validCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];
    if (validCategories.includes(category)) {
      return category;
    }
    return 'Other';
  } catch (error) {
    console.error('AI categorization error:', error);
    return 'Other';
  }
}

export async function generateSpendingInsights(expenses) {
  try {
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly expense tracking assistant helping someone manage their money better. Be conversational, encouraging, and specific.'
        },
        {
          role: 'user',
          content: `You're a friendly expense tracking assistant helping someone manage their money better. Analyze their spending and give 3-4 casual, specific tips.

Total spent: $${totalSpent.toFixed(2)}
Category breakdown: ${JSON.stringify(categoryTotals)}
Number of expenses: ${expenses.length}

Rules:
- Be conversational and friendly (use "you" and "your")
- Reference SPECIFIC dollar amounts from their actual spending
- Mention the actual categories they spent on
- Keep each tip under 20 words
- Be encouraging, not judgmental
- No generic advice - make it personal to THEIR data
- Use varied punctuation (periods, commas, exclamation marks, ellipsis) instead of dashes to sound natural
- Avoid using "-" or "–" in tips

Return ONLY a JSON array of strings. Example: ["You spent $50 on Entertainment. Maybe try one free activity this week!", "Your Food spending hit $120. Meal prepping could save you $30-40"]`
        }
      ],
      temperature: 0.8,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0].message.content.trim();
    
    // Try to parse as JSON
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      return insights;
    }
    
    // Fallback: try parsing the whole response
    try {
      const parsed = JSON.parse(text);
      if (parsed.tips || parsed.insights) {
        return parsed.tips || parsed.insights;
      }
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.warn('JSON parsing fallback failed');
    }
    
    return ['Unable to generate insights at this time.'];
  } catch (error) {
    console.error('AI insights error:', error);
    return ['Unable to generate insights. Please try again later.'];
  }
}