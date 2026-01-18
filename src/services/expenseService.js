import { supabase } from './supabaseClient';

// Get all expenses
export async function getAllExpenses() {
  try {
    if (!supabase) {
      console.error('Supabase not initialized');
      return [];
    }
    const { data, error } = await supabase
      .from('Expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

// Add a new expense
export async function addExpense(expense) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }
    
    const expenseData = {
      amount: expense.amount ? parseFloat(expense.amount) : 0,
      description: expense.description || '',
      category: expense.category || 'Other',
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    
    console.log('Attempting to insert expense:', expenseData);
    
    const { data, error } = await supabase
      .from('Expenses')
      .insert([expenseData])
      .select();
    
    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to add expense: ${error.message}`);
    }
    
    console.log('Insert response:', data);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

// Update an expense
export async function updateExpense(id, expense) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }
    
    const expenseData = {
      amount: expense.amount ? parseFloat(expense.amount) : 0,
      description: expense.description || '',
      category: expense.category || 'Other',
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    
    console.log('Attempting to update expense:', id, expenseData);
    
    const { data, error } = await supabase
      .from('Expenses')
      .update(expenseData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to update expense: ${error.message}`);
    }
    
    console.log('Update response:', data);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

// Delete an expense
export async function deleteExpense(id) {
  try {
    if (!supabase) {
      throw new Error('Supabase not initialized');
    }
    const { error } = await supabase
      .from('Expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}