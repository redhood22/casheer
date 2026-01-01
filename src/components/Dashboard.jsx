import React from 'react'
import { categoryColors, formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../lib/utils'

const StatCard = ({title, value, subtitle, isTotal}) => (
  <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-transparent hover:border-t-emerald-600 dark:hover:border-t-emerald-600">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
        <div className={`mt-2 text-2xl font-semibold ${isTotal ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'}`}>{value}</div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>
      </div>
    </div>
  </div>
)

export default function Dashboard({ expenses, settings }) {
  const formatCurrency = (amount) => {
    return formatCurrencyUtil(amount, settings?.currency || 'USD')
  }

  const formatDate = (dateStr) => {
    return formatDateUtil(dateStr, settings?.dateFormat || 'MM/DD/YYYY')
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate this month's expenses
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthlyExpenses = expenses.reduce((sum, exp) => {
    const expDate = new Date(exp.date)
    if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
      return sum + exp.amount
    }
    return sum
  }, 0)

  // Count unique categories
  const uniqueCategories = new Set(expenses.map(exp => exp.category)).size

  // Get 5 most recent expenses
  const recentExpenses = expenses.slice(0, 5)

  return (
    <main className="fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(totalExpenses)} 
          subtitle={expenses.length === 0 ? 'No expenses recorded yet' : `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}
          isTotal={true}
        />
        <StatCard 
          title="This Month" 
          value={formatCurrency(monthlyExpenses)} 
          subtitle={monthlyExpenses === 0 ? 'Start tracking your expenses' : `In ${now.toLocaleString('en-US', { month: 'long' })}`}
        />
        <StatCard 
          title="Categories" 
          value={uniqueCategories} 
          subtitle={uniqueCategories === 0 ? 'Create your first category' : `${uniqueCategories} categor${uniqueCategories !== 1 ? 'ies' : 'y'}`}
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h3>
        </div>
        {recentExpenses.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-400">
            No activity yet. Add your first expense to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{expense.description}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-3 items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full" style={{background: categoryColors[expense.category] || '#94a3b8'}} />
                    <span className="px-2 py-0.5 rounded text-xs" style={{background: categoryColors[expense.category]+'22', color: categoryColors[expense.category]}}>{expense.category}</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
