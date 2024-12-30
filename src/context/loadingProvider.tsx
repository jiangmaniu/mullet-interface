import { SpinLoading } from 'antd-mobile'
import React, { createContext, useCallback, useContext, useState } from 'react'

type Options = { color?: string; backgroundColor?: string }

interface LoadingContextProps {
  loading: boolean
  showLoading: (options?: Options) => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState('black')
  const [backgroundColor, setBackgroundColor] = useState('')

  const showLoading = useCallback((options?: Options) => {
    setLoading(true)
    setColor(options?.color || 'black')
    setBackgroundColor(options?.backgroundColor || 'rgba(0, 0, 0, 0.5)')
  }, [])

  const hideLoading = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <SpinLoading color={color} style={{ '--size': '24px' }} />
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
