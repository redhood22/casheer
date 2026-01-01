import React, { useState } from 'react'
import { Plus, Menu } from 'lucide-react'

export default function Header({ onNewExpense, onNewCategory, onToggleSidebar }){
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu size={20} className="text-slate-600" />
            </button>
            <button onClick={onNewExpense} className="flex items-end gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-2 h-3 bg-[#10b981] rounded-full logo-bar-1"></div>
              <div className="w-2 h-4 bg-[#34d399] rounded-full logo-bar-2"></div>
              <div className="w-2 h-6 bg-[#3B82F6] rounded-full logo-bar-3"></div>
            </button>
            <div>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Casher</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Expense tracker</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setOpen(v => !v)} className="px-3 py-1.5 rounded-md text-sm bg-emerald-600 text-white border border-transparent hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 flex items-center gap-2 transition-colors">
                <span>New</span>
                <Plus size={16} />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded shadow-sm z-50 dark:bg-slate-800 dark:border-slate-700">
                  <button onClick={() => { setOpen(false); onNewExpense && onNewExpense() }} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700">New Expense</button>
                  <button onClick={() => { setOpen(false); onNewCategory && onNewCategory() }} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700">New Category</button>
                </div>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </header>
  )
}
