import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-500 text-center">
        © {new Date().getFullYear()} Casher — Minimal expense tracker UI
      </div>
    </footer>
  )
}
