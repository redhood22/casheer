import React, { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2, Wallet } from 'lucide-react'
import { categoryColors, formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../lib/utils'

export default function Expenses({ expenses, setExpenses, categories, setCategories, showToast, openForm, settings }) {
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: categories && categories.length ? categories[0] : 'Food',
    date: new Date().toISOString().split('T')[0]
  })
  const [filters, setFilters] = useState({ category: 'All', q: '' })
  const amountRef = useRef(null)

  useEffect(()=>{
    if(openForm && amountRef.current){
      amountRef.current.focus()
    }
  },[openForm])

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
      showToast && showToast('Expense updated!')
    } else {
      const newExpense = {
        id: Date.now(),
        ...form,
        amount: parseFloat(form.amount)
      }
      setExpenses(prev => [newExpense, ...prev])
      showToast && showToast('Expense added!')
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
      showToast && showToast('Expense deleted!')
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
    return formatCurrencyUtil(amount, settings?.currency || 'USD')
  }

  const formatDate = (dateStr) => {
    return formatDateUtil(dateStr, settings?.dateFormat || 'MM/DD/YYYY')
  }

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Expenses</h1>

      {/* Add Expense Form */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-500">{formatCurrency(0).slice(0, 1)}</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  ref={amountRef}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
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
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="button" onClick={() => {
                  const name = window.prompt('New category name')
                  if (name) {
                    setCategories(prev => Array.from(new Set([name, ...prev])))
                    setForm(prev => ({ ...prev, category: name }))
                    showToast && showToast('Category added')
                  }
                }} className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors">+ Add</button>
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
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors"
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

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <select value={filters.category} onChange={(e)=>setFilters(prev=>({...prev, category: e.target.value}))} className="px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
              <option value="All">All</option>
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Search description" value={filters.q} onChange={(e)=>setFilters(prev=>({...prev, q:e.target.value}))} className="px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400" />
            <button onClick={()=>setFilters({category:'All', q:''})} className="px-3 py-2 bg-slate-100 rounded dark:bg-slate-700">Clear</button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">All Expenses</h2>
        {expenses.length === 0 ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center text-slate-400">
            <Wallet size={80} className="mb-4 text-slate-300" />
            <div className="text-lg font-medium">No expenses yet</div>
            <div className="text-sm text-slate-500">Start tracking your spending!</div>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.filter(exp=> (filters.category==='All' || exp.category===filters.category) && exp.description.toLowerCase().includes(filters.q.toLowerCase())).map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full" style={{background: categoryColors[expense.category] || '#94a3b8'}} />
                    {expense.description}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-4 mt-1">
                    <span className="px-2 py-0.5 rounded text-xs" style={{background: categoryColors[expense.category]+'22', color: categoryColors[expense.category]}}>{expense.category}</span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mr-4">
                  {formatCurrency(expense.amount)}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} className="text-slate-400 hover:text-blue-500" />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-slate-400 hover:text-red-500" />
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
