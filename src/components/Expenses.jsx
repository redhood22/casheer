import React, { useState } from 'react'
import { Edit, Trash } from './icons'

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']

export default function Expenses({ expenses, setExpenses }) {
  const [editingId, setEditingId] = useState(null)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900 mb-6">Expenses</h1>

      {/* Add Expense Form */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g., Groceries at Whole Foods"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Expenses</h2>
        {expenses.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-400">
            No expenses yet. Add one to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{expense.description}</div>
                  <div className="text-sm text-slate-500 flex gap-4 mt-1">
                    <span>{expense.category}</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900 mr-4">
                  {formatCurrency(expense.amount)}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="p-2 rounded-md hover:bg-slate-100 transition-colors"
                    title="Edit"
                  >
                    <Edit />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 rounded-md hover:bg-slate-100 transition-colors"
                    title="Delete"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
