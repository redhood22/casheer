import React, { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, Zap } from 'lucide-react'
import { generateSpendingInsights } from '../services/openaiService'

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
  const [insights, setInsights] = useState([])
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState(null)
  const [lastRefreshTime, setLastRefreshTime] = useState(0)
  const [cooldownTime, setCooldownTime] = useState(0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Generate insights on component load or when expenses change
  useEffect(() => {
    if (expenses.length > 0) {
      loadInsights()
    }
  }, [expenses.length])

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  const loadInsights = async () => {
    if (expenses.length === 0) {
      setInsights([])
      return
    }

    setInsightsLoading(true)
    setInsightsError(null)
    try {
      const result = await generateSpendingInsights(expenses)
      if (Array.isArray(result)) {
        setInsights(result)
      } else {
        setInsights([])
        setInsightsError('Unable to generate insights')
      }
    } catch (error) {
      console.error('Failed to generate insights:', error)
      setInsightsError('Failed to generate insights. Please try again.')
      setInsights([])
    } finally {
      setInsightsLoading(false)
    }
  }

  const handleRefreshInsights = async () => {
    const now = Date.now()
    if (now - lastRefreshTime < 10000) {
      setCooldownTime(10 - Math.floor((now - lastRefreshTime) / 1000))
      return
    }
    setLastRefreshTime(now)
    await loadInsights()
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

      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-emerald-600" />
            <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">AI</span>
          </div>
          <button
            onClick={handleRefreshInsights}
            disabled={insightsLoading || cooldownTime > 0}
            className="p-2 rounded-lg hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={cooldownTime > 0 ? `Wait ${cooldownTime}s` : 'Refresh insights'}
          >
            <RefreshCw 
              size={18} 
              className={`text-emerald-600 ${insightsLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="min-h-[120px] flex items-center justify-center text-slate-400">
            Add expenses to get AI-powered insights
          </div>
        ) : insightsLoading ? (
          <div className="min-h-[120px] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <Sparkles size={24} className="text-emerald-600" />
              </div>
              <p className="text-sm text-slate-500 mt-2">Generating insights...</p>
            </div>
          </div>
        ) : insightsError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{insightsError}</p>
          </div>
        ) : insights.length > 0 ? (
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700">
                <Zap size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 bg-white/50 rounded-lg">
            <p className="text-sm text-slate-600">No insights available</p>
          </div>
        )}
      </div>
    </main>
  )
}
