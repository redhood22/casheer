import React, { useEffect } from 'react'
import { Check } from 'lucide-react'

export default function Toast({ message, onClose }){
  useEffect(()=>{
    if(!message) return
    const t = setTimeout(()=> onClose && onClose(), 3000)
    return ()=> clearTimeout(t)
  },[message])

  if(!message) return null
  return (
    <div className="fixed right-4 bottom-6 bg-emerald-600 border border-emerald-700 px-4 py-3 rounded shadow-lg z-50 animate-toast">
      <div className="flex items-center gap-3 text-white">
        <Check size={20} strokeWidth={3} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
