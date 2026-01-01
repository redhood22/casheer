import React from 'react'
import { formatCurrency } from '../lib/utils'

export default function Settings({ expenses, setExpenses, categories, setCategories, settings, setSettings, showToast }){

  const handleExport = () => {
    const header = ['id','amount','description','category','date']
    const rows = expenses.map((e,idx)=>[idx+1, e.amount, `"${(e.description||'').replace(/"/g,'""')}"`, e.category, e.date])
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'casher-expenses.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast('Exported CSV')
  }

  const handleClear = () => {
    if(window.confirm('Clear all expenses and categories? This cannot be undone.')){
      setExpenses([])
      setCategories(['Food','Transport','Entertainment','Shopping','Bills','Other'])
      localStorage.removeItem('casher_state')
      showToast('Data cleared')
    }
  }

  return (
    <div className="fade-in space-y-6">
      <div className="bg-white rounded-lg shadow p-6 dark:bg-slate-800 dark:text-slate-100">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Theme</div>
            <select value={settings?.theme} onChange={(e)=>{ setSettings(prev=>({...prev,theme:e.target.value})); showToast('Theme updated') }} className="mt-2 px-2 py-1 border rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Currency</div>
            <select value={settings?.currency} onChange={(e)=>{ setSettings(prev=>({...prev,currency:e.target.value})); showToast('Currency updated') }} className="mt-2 px-2 py-1 border rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
              <option value="USD">USD (United States Dollar)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="NGN">NGN (Nigerian Naira)</option>
            </select>
          </div>
          <div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Date Format</div>
            <select value={settings?.dateFormat} onChange={(e)=>{ setSettings(prev=>({...prev,dateFormat:e.target.value})); showToast('Date format updated') }} className="mt-2 px-2 py-1 border rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
              <option value="MM/DD/YYYY">MM/DD/YYYY (01/28/2025)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (28/01/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-01-28)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 dark:bg-slate-800 dark:text-slate-100">
        <h2 className="text-lg font-semibold">Data</h2>
        <div className="mt-4 flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>
          <button onClick={handleClear} className="px-4 py-2 bg-red-50 text-red-700 rounded border border-red-200">Clear All Data</button>
        </div>
        <div className="mt-4 text-sm text-slate-500">Exported CSV contains your expenses for backup or import.</div>
      </div>
    </div>
  )
}
