import { categoryColorMap } from '../lib/categoryColors';
import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil } from '../lib/utils'

const getColorForCategory = (category) => {
  return categoryColorMap[category]?.chart || '#ef4444';
}

const SummaryCard = ({ title, value, subtitle, categoryColor }) => (
  <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-transparent hover:border-t-blue-500 dark:hover:border-t-sky-400">
    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{title}</div>
    <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
      {categoryColor && <span className="inline-block w-2 h-2 rounded-full" style={{background: categoryColor}} />}
      {value}
    </div>
    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</div>
  </div>
)

export default function Reports({ expenses, settings }) {
  const formatCurrency = (amount) => {
    return formatCurrencyUtil(amount, settings?.currency || 'USD')
  }

  const formatDate = (dateStr) => {
    return formatDateUtil(dateStr, settings?.dateFormat || 'MM/DD/YYYY')
  }

  // Category to color mapping
  const COLORS = Object.values(categoryColorMap).map(c => c.chart);

  // Get current month expenses
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
  })

  const lastMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear
    return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastYear
  })

  // 1. Expenses by category (bar chart)
  const categoryData = {}
  expenses.forEach(exp => {
    categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount
  })
  const categoryChartData = Object.entries(categoryData)
    .map(([category, total]) => ({ category, total: parseFloat(total.toFixed(2)) }))
    .sort((a, b) => b.total - a.total)

  // 2. Spending over time (line chart - daily for current month)
  const dailyData = {}
  currentMonthExpenses.forEach(exp => {
    const date = exp.date
    dailyData[date] = (dailyData[date] || 0) + exp.amount
  })
  const spendingChartData = Object.entries(dailyData)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: parseFloat(amount.toFixed(2))
    }))

  // 3. Category distribution (pie chart)
  const pieData = categoryChartData.map(({ category, total }) => ({
    name: category,
    value: total
  }))

  // Summary stats
  const totalThisMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalLastMonth = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const daysInMonth = currentMonthExpenses.length > 0
    ? new Set(currentMonthExpenses.map(exp => exp.date)).size
    : 1

  const avgDailySpending = daysInMonth > 0 ? totalThisMonth / daysInMonth : 0

  const highestCategory = categoryChartData.length > 0 ? categoryChartData[0].category : 'N/A'

  return (
    <main className="fade-in">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Reports</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Average Daily Spending"
          value={formatCurrency(avgDailySpending)}
          subtitle="This month"
        />
        <SummaryCard
          title="Highest Category"
          value={highestCategory}
          subtitle={highestCategory !== 'N/A' ? formatCurrency(categoryChartData[0].total) : 'No data'}
          categoryColor={highestCategory !== 'N/A' ? getColorForCategory(highestCategory) : null}
        />
        <SummaryCard
          title="This Month vs Last"
          value={`${formatCurrency(totalThisMonth)}`}
          subtitle={totalLastMonth > 0 ? `Last month: ${formatCurrency(totalLastMonth)}` : 'Last month: N/A'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Expenses by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Expenses by Category</h3>
          {categoryChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }} />
                <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForCategory(entry.category)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart - Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Category Distribution</h3>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForCategory(entry.name)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line Chart - Spending Over Time */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Spending Over Time ({now.toLocaleString('en-US', { month: 'long', year: 'numeric' })})</h3>
        {spendingChartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
                name="Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </main>
  )
}
