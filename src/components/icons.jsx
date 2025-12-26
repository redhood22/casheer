import React from 'react'

const Icon = ({children}) => (
  <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-slate-100 text-slate-600">{children}</span>
)

export const Home = () => (
  <Icon>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21h14a1 1 0 0 0 1-1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Icon>
)

export const Receipt = () => (
  <Icon>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 6v13a1 1 0 0 1-1 1H4l1-3 1 1 1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Icon>
)

export const Chart = () => (
  <Icon>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 14v4M12 10v8M17 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Icon>
)

export const Gear = () => (
  <Icon>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.28 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.688 0 1.268-.37 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 6.7 2.28l.06.06c.44.44 1.09.54 1.6.24.5-.3.8-.86.8-1.48V1a2 2 0 1 1 4 0v.09c0 .62.3 1.18.8 1.48.51.3 1.16.2 1.6-.24l.06-.06A2 2 0 0 1 19.72 6.7l-.06.06c-.44.44-.54 1.09-.24 1.6.3.5.86.8 1.48.8H21a2 2 0 1 1 0 4h-.09c-.62 0-1.18.3-1.48.8-.3.51-.2 1.16.24 1.6z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Icon>
)
