import React from 'react'

const StatCard = ({title, value, subtitle}) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
      </div>
    </div>
  </div>
)

export default function Dashboard({ expenses }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(totalExpenses)} 
          subtitle={expenses.length === 0 ? 'No expenses recorded yet' : `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}
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
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        </div>
        {recentExpenses.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-400">
            No activity yet. Add your first expense to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{expense.description}</div>
                  <div className="text-sm text-slate-500 flex gap-4 mt-1">
                    <span>{expense.category}</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900">
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
