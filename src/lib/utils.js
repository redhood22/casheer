export const categoryColors = {
  Shopping: '#2563eb',
  Food: '#10b981',
  Entertainment: '#7c3aed',
  Bills: '#06b6d4',
  Transport: '#f59e0b',
  Other: '#f43f5e'
}

export function formatCurrency(amount, currency = 'USD'){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(dateStr, format = 'MM/DD/YYYY'){
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  switch(format){
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`
  }
}

export function relativeDateLabel(dateStr){
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - d) / (1000*60*60*24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return d.toLocaleDateString()
}

