import React from 'react'
import { LayoutDashboard, Wallet, BarChart3, Settings } from 'lucide-react'

const NavItem = ({icon, label, active, onClick}) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 border-l-4 ${active ? 'border-l-emerald-600 bg-slate-200 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 font-semibold' : 'border-l-transparent hover:border-l-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
    <div className="flex-shrink-0 text-slate-700 dark:text-slate-200">{icon}</div>
    <div className="text-sm font-medium dark:text-slate-100">{label}</div>
  </div>
)

export default function Sidebar({currentPage, setCurrentPage, mobileOpen}){
  return (
    <aside className={`space-y-6 ${mobileOpen ? 'block' : 'hidden md:block'}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-semibold">Navigation</div>
        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <NavItem icon={<Wallet size={20} />} label="Expenses" active={currentPage === 'expenses'} onClick={() => setCurrentPage('expenses')} />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" active={currentPage === 'reports'} onClick={() => setCurrentPage('reports')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
        </nav>
      </div>
      <div className="card">
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">Shortcuts</div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setCurrentPage('expenses')} className="text-sm text-slate-700 dark:text-slate-200 text-left px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Create Expense</button>
          <button onClick={() => setCurrentPage('expenses')} className="text-sm text-slate-700 dark:text-slate-200 text-left px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Add Category</button>
        </div>
      </div>
    </aside>
  )
}
