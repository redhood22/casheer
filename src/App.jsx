import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <Sidebar />
          <main className="bg-white rounded-lg shadow-sm p-6 min-h-[60vh]">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Dashboard</h2>
            <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
              Main content placeholder
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
