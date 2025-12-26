import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

const StatCard = ({title, value, subtitle}) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
      </div>
    </div>
  </div>
)

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <Sidebar />

          <main>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Expenses" value="$0.00" subtitle="No expenses recorded yet" />
              <StatCard title="This Month" value="$0.00" subtitle="Start tracking your expenses" />
              <StatCard title="Categories" value="0" subtitle="Create your first category" />
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <div className="min-h-[200px] flex items-center justify-center text-slate-400">
                No activity yet. Add your first expense to get started!
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
