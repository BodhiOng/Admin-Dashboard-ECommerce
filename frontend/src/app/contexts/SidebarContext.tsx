'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'

type SidebarContextType = {
  isMinimized: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized)
  }

  useEffect(() => {
    const rootElement = document.documentElement
    if (isMinimized) {
      rootElement.classList.add('sidebar-minimized')
    } else {
      rootElement.classList.remove('sidebar-minimized')
    }
  }, [isMinimized])

  return (
    <SidebarContext.Provider value={{ isMinimized, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
