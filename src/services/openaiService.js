import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

console.log('API Key status:', API_KEY ? '✓ Found' : '✗ Missing');

if (!API_KEY) {
  console.error('❌ VITE_OPENAI_API_KEY not found in .env.local');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

export async function categorizeExpense(description) {
  try {
    if (!description.trim()) {
      return 'Other';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that categorizes expenses. Respond with ONLY one category name from this list: Food, Transport, Entertainment, Shopping, Bills, Other'
        },
        {
          role: 'user',
          content: `Categorize this expense: "${description}". Reply with only the category name, nothing else.`
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const category = response.choices[0].message.content.trim();
    const validCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];
    
    return validCategories.includes(category) ? category : 'Other';
  } catch (error) {
    console.error('AI categorization error:', error);
    return 'Other';
  }
}

export async function generateSpendingInsights(expenses) {
  try {
    if (!expenses || expenses.length === 0) {
      return ['Start tracking expenses to get personalized insights!'];
    }

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = {};
    
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    // Calculate number of tips based on expense count
    const tipCount = expenses.length <= 2 ? 2 : 
                     expenses.length <= 5 ? 3 : 
                     expenses.length <= 10 ? 4 : 5;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly expense tracking assistant helping someone manage their money better.'
        },
        {
          role: 'user',
          content: `You're a friendly expense tracking assistant helping someone manage their money better. Analyze their spending and give exactly ${tipCount} casual, specific tips.

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
- Use varied punctuation (periods, commas, exclamation marks, ellipsis) instead of dashes

Return ONLY a JSON array of exactly ${tipCount} strings. Example: ["You spent $50 on Entertainment. Maybe try one free activity this week!", "Your Food spending is $120. Meal prepping could save you $30-40!"]`
        }
      ],
      temperature: 0.8,
      max_tokens: 400
    });

    try {
      const insights = JSON.parse(response.choices[0].message.content);
      return Array.isArray(insights) ? insights : ['Unable to generate insights at this moment'];
    } catch {
      return ['Unable to generate insights at this moment'];
    }
  } catch (error) {
    console.error('AI insights error:', error);
    return ['Unable to generate insights at this moment'];
  }
}