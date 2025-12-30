import React from 'react'
import { Home, Receipt, Chart, Gear } from './icons'

const NavItem = ({icon, label, active, onClick}) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${active ? 'bg-sky-50 border border-sky-100 text-sky-700' : 'hover:bg-slate-50'}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="text-sm font-medium">{label}</div>
  </div>
)

export default function Sidebar({currentPage, setCurrentPage}){
  return (
    <aside className="space-y-6">
      <div className="card">
        <div className="text-sm text-slate-500 mb-3">Navigation</div>
        <nav className="flex flex-col gap-2">
          <NavItem icon={<Home/>} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <NavItem icon={<Receipt/>} label="Expenses" active={currentPage === 'expenses'} onClick={() => setCurrentPage('expenses')} />
          <NavItem icon={<Chart/>} label="Reports" active={currentPage === 'reports'} onClick={() => setCurrentPage('reports')} />
          <NavItem icon={<Gear/>} label="Settings" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
        </nav>
      </div>
      <div className="card">
        <div className="text-sm text-slate-500 mb-2">Shortcuts</div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setCurrentPage('expenses')} className="text-sm text-slate-700 text-left px-2 py-1 rounded hover:bg-slate-50">Create Expense</button>
          <button className="text-sm text-slate-700 text-left px-2 py-1 rounded hover:bg-slate-50">Add Category</button>
        </div>
      </div>
    </aside>
  )
}
