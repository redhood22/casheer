import React, { useState } from 'react'
import { Edit, Trash2, Pencil } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { categorizeExpense } from '../services/openaiService'
import { categoryColorMap } from '../lib/categoryColors';

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']

export default function Expenses({ expenses, setExpenses, settings }) {
  const [editingId, setEditingId] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || !form.description) return

    if (editingId) {
      setExpenses(prev => prev.map(exp =>
        exp.id === editingId
          ? { ...exp, ...form, amount: parseFloat(form.amount) }
          : exp
      ))
      setEditingId(null)
    } else {
      const newExpense = {
        id: Date.now(),
        ...form,
        amount: parseFloat(form.amount)
      }
      setExpenses(prev => [newExpense, ...prev])
    }

    setForm({
      amount: '',
      description: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleEdit = (expense) => {
    setEditingId(expense.id)
    setForm({
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      date: expense.date
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({
      amount: '',
      description: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleAISuggest = async () => {
    if (!form.description.trim()) return

    setAiLoading(true)
    try {
      const suggestedCategory = await categorizeExpense(form.description)
      setForm(prev => ({ ...prev, category: suggestedCategory }))
    } catch (error) {
      console.error('AI suggest failed:', error)
    } finally {
      setAiLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateStr, format = 'MM/DD/YYYY') => {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`
    if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`
    return `${month}/${day}/${year}` // MM/DD/YYYY
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Expenses</h1>

      {/* Add Expense Form */}
      <div className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 rounded-lg p-6 bg-white shadow-lg dark:shadow-slate-900/50 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-500 dark:text-slate-400">$</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={!form.description.trim() || aiLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Sparkles size={18} />
                  {aiLoading ? 'Suggesting...' : 'AI Suggest'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g., Groceries at Whole Foods"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-[#2563eb] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingId ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full md:w-auto px-6 py-2 ml-2 bg-slate-200 text-slate-900 font-medium rounded-lg hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Expenses List */}
      <div className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 rounded-lg p-6 bg-white shadow-lg dark:shadow-slate-900/50">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">All Expenses</h2>
        {expenses.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-500">
            No expenses yet. Add one to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => {
              const categoryColors = categoryColorMap[expense.category] || categoryColorMap.Other;
              return (
                <div
                  key={expense.id}
                  className="p-3 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${categoryColors.dot}`}></div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{expense.description}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-4">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${categoryColors.bg} ${categoryColors.text}`}>
                          {expense.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(expense.date, settings?.dateFormat)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(expense.amount, settings?.currency || 'USD')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(expense)
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(expense.id)
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
