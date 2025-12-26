import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} Casher</div>
        <div className="flex items-center gap-4">
          <a className="hover:underline" href="#">Privacy</a>
          <a className="hover:underline" href="#">Terms</a>
          <a className="hover:underline" href="#">Support</a>
        </div>
      </div>
    </footer>
  )
}
