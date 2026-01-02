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

export default function App(){
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [expenses, setExpenses] = useState([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [categories, setCategories] = useState(['Food','Transport','Entertainment','Shopping','Bills','Other'])
  const [settings, setSettings] = useState({ theme: 'light', currency: 'USD', dateFormat: 'MM/DD/YYYY' })

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('casher_state')
      if(raw){
        const parsed = JSON.parse(raw)
        if(parsed.expenses) setExpenses(parsed.expenses)
        if(parsed.categories) setCategories(parsed.categories)
        if(parsed.settings) setSettings(parsed.settings)
      }
    }catch(e){
      console.warn('Failed to load state', e)
    }
  }, [])

  useEffect(()=>{
    try{
      const payload = { expenses, categories, settings }
      localStorage.setItem('casher_state', JSON.stringify(payload))
    }catch(e){
      console.warn('Failed to save state', e)
    }
  }, [expenses, categories, settings])

  useEffect(()=>{
    if(settings?.theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [settings?.theme])

  const renderPage = () => {
    if (currentPage === 'expenses') {
      return <Expenses expenses={expenses} setExpenses={setExpenses} categories={categories} setCategories={setCategories} showToast={(msg) => setToast(msg)} openForm={false} settings={settings} />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <Sidebar currentPage={currentPage} setCurrentPage={(p)=>{setCurrentPage(p); setMobileSidebarOpen(false)}} mobileOpen={mobileSidebarOpen} />

          {renderPage()}
        </div>
      </div>
      <Toast message={toast} onClose={()=>setToast(null)} />
      <Footer />
    </div>
  )
}

