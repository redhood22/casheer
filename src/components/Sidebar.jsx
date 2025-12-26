import React from 'react'
import { Home, PieChart, Calendar } from './icons'

const NavItem = ({children, label}) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
    <div className="text-slate-500">{children}</div>
    <div className="text-sm text-slate-700">{label}</div>
  </div>
)

export default function Sidebar(){
  return (
    <aside className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-slate-500 mb-2">Overview</div>
        <nav className="flex flex-col gap-1">
          <NavItem label="Dashboard"><Home/></NavItem>
          <NavItem label="Reports"><PieChart/></NavItem>
          <NavItem label="Calendar"><Calendar/></NavItem>
        </nav>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-slate-500 mb-2">Tags</div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 bg-slate-100 rounded">Groceries</span>
          <span className="text-xs px-2 py-1 bg-slate-100 rounded">Rent</span>
          <span className="text-xs px-2 py-1 bg-slate-100 rounded">Utilities</span>
        </div>
      </div>
    </aside>
  )
}
