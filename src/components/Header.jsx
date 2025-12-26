import React from 'react'

export default function Header(){
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[linear-gradient(135deg,#2563eb,#7c3aed)] rounded flex items-center justify-center text-white font-semibold">C</div>
            <div>
              <div className="text-lg font-semibold text-slate-900">Casher</div>
              <div className="text-xs text-slate-500">Expense tracker</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <button className="px-3 py-1.5 rounded-md text-sm bg-sky-50 text-sky-700 border border-transparent hover:bg-sky-100">New</button>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </header>
  )
}
