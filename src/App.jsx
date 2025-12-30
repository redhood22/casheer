import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Expenses from './components/Expenses'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'

export default function App(){
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [expenses, setExpenses] = useState([])

  const renderPage = () => {
    if (currentPage === 'expenses') {
      return <Expenses expenses={expenses} setExpenses={setExpenses} />
    }
    if (currentPage === 'reports') {
      return <Reports expenses={expenses} />
    }
    return <Dashboard expenses={expenses} />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {renderPage()}
        </div>
      </div>
      <Footer />
    </div>
  )
}
