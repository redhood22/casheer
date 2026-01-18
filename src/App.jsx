import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Expenses from './components/Expenses'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'
import Settings from './components/Settings'
import { categoryColors } from './lib/utils'
import Toast from './components/Toast'
import { getAllExpenses, addExpense as dbAddExpense, updateExpense as dbUpdateExpense, deleteExpense as dbDeleteExpense } from './services/expenseService'

export default function App(){
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [expenses, setExpenses] = useState([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [categories, setCategories] = useState(['Food','Transport','Entertainment','Shopping','Bills','Other'])
  const [settings, setSettings] = useState({ theme: 'light', currency: 'USD', dateFormat: 'MM/DD/YYYY' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load expenses from Supabase on component mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllExpenses()
        setExpenses(data)
      } catch (err) {
        console.error('Failed to load expenses:', err)
        setError('Failed to load expenses from database')
        setToast('Error loading expenses')
      } finally {
        setLoading(false)
      }
    }
    loadExpenses()
  }, [])

  // Load settings from localStorage (keep for non-database settings)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('casher_settings')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.categories) setCategories(parsed.categories)
        if (parsed.settings) setSettings(parsed.settings)
      }
    } catch (e) {
      console.warn('Failed to load settings', e)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    try {
      const payload = { categories, settings }
      localStorage.setItem('casher_settings', JSON.stringify(payload))
    } catch (e) {
      console.warn('Failed to save settings', e)
    }
  }, [categories, settings])

  useEffect(()=>{
    if(settings?.theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [settings?.theme])

  // Add expense to database and refresh list
  const addExpense = async (expense) => {
    try {
      setError(null)
      await dbAddExpense(expense)
      setToast('Expense added successfully')
      // Refresh expenses list
      const data = await getAllExpenses()
      setExpenses(data)
    } catch (err) {
      console.error('Failed to add expense:', err)
      setError('Failed to add expense')
      setToast('Error adding expense')
    }
  }

  // Update expense in database and refresh list
  const updateExpense = async (id, expense) => {
    try {
      setError(null)
      await dbUpdateExpense(id, expense)
      setToast('Expense updated successfully')
      // Refresh expenses list
      const data = await getAllExpenses()
      setExpenses(data)
    } catch (err) {
      console.error('Failed to update expense:', err)
      setError('Failed to update expense')
      setToast('Error updating expense')
    }
  }

  // Delete expense from database and refresh list
  const deleteExpense = async (id) => {
    try {
      setError(null)
      await dbDeleteExpense(id)
      setToast('Expense deleted successfully')
      // Refresh expenses list
      const data = await getAllExpenses()
      setExpenses(data)
    } catch (err) {
      console.error('Failed to delete expense:', err)
      setError('Failed to delete expense')
      setToast('Error deleting expense')
    }
  }

  const renderPage = () => {
    if (currentPage === 'expenses') {
      return <Expenses expenses={expenses} settings={settings} onAddExpense={addExpense} onUpdateExpense={updateExpense} onDeleteExpense={deleteExpense} />
    }
    if (currentPage === 'reports') {
      return <Reports expenses={expenses} settings={settings} />
    }
    if (currentPage === 'settings') {
      return <Settings expenses={expenses} setExpenses={setExpenses} categories={categories} setCategories={setCategories} settings={settings} setSettings={setSettings} showToast={(msg)=>setToast(msg)} />
    }
    return <Dashboard expenses={expenses} settings={settings} />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Header onNewExpense={() => { setCurrentPage('expenses'); setTimeout(()=>document.querySelector('input[name="amount"]')?.focus(), 100) }} onNewCategory={() => {
        setCurrentPage('expenses');
        setTimeout(()=>{
          const name = window.prompt('New category name')
          if(name && name.trim()){
            setCategories(prev=>Array.from(new Set([name.trim(), ...prev])))
            setToast('Category added')
            setTimeout(()=>setToast(null), 2500)
          }
        }, 150)
      }} onToggleSidebar={()=>setMobileSidebarOpen(v=>!v)} />
      
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2563eb] border-r-[#2563eb] animate-spin"></div>
                </div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading expenses...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
            <Sidebar currentPage={currentPage} setCurrentPage={(p)=>{setCurrentPage(p); setMobileSidebarOpen(false)}} mobileOpen={mobileSidebarOpen} />

            {renderPage()}
          </div>
        </div>
      )}
      
      <Toast message={toast} onClose={()=>setToast(null)} />
      <Footer />
    </div>
  )
}

