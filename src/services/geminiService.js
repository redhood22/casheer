import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * AI FEATURE 1:
 * Automatically categorize an expense description
 * Example: "Shoprite 4k" -> "Food"
 */
export async function categorizeExpense(description) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a financial assistant.
Categorize the following expense into ONE category only.

Categories:
Food, Transport, Entertainment, Shopping, Bills, Other

Expense description:
"${description}"

Respond with ONLY the category name.
`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();

    const validCategories = [
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Bills",
      "Other",
    ];

    return validCategories.includes(category) ? category : "Other";
  } catch (error) {
    console.error("AI categorization error:", error);
    return "Other";
  }
}

/**
 * AI FEATURE 2:
 * Generate spending insights from expense data
 */
export async function generateSpendingInsights(expenses) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const totalSpent = expenses.reduce(
      (sum, exp) => sum + Number(exp.amount),
      0
    );

    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    const prompt = `
You are a financial advisor.
Analyze the spending data below and give 3 short, practical tips.

Total spent: ₦${totalSpent}
Spending by category: ${JSON.stringify(categoryTotals)}

Return the response as a JSON array of strings.
Example:
["Tip 1", "Tip 2", "Tip 3"]

Respond with ONLY the JSON array.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : ["No insights available."];
  } catch (error) {
    console.error("AI insights error:", error);
    return ["Unable to generate insights at this time."];
  }
}
