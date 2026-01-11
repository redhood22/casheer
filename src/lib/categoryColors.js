export const categoryColorMap = {
  Food: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    chart: '#10b981'
  },
  Transport: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    chart: '#f59e0b'
  },
  Entertainment: {
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    chart: '#7c3aed'
  },
  Bills: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
    chart: '#06b6d4'
  },
  Shopping: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    chart: '#2563eb'
  },
  Other: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    chart: '#f43f5e'
  }
};

export function getCategoryColor(category, type = 'bg') {
  const colors = categoryColorMap[category] || categoryColorMap.Other;
  return colors[type] || colors.bg;
}