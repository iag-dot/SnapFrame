"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface FrameContextType {
  uploadedImage: string | null
  setUploadedImage: (image: string | null) => void
}

const FrameContext = createContext<FrameContextType | null>(null)

export function FrameProvider({ children }: { children: ReactNode }) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  return (
    <FrameContext.Provider value={{ uploadedImage, setUploadedImage }}>
      {children}
    </FrameContext.Provider>
  )
}

export function useFrame() {
  const context = useContext(FrameContext)
  if (!context) {
    throw new Error("useFrame must be used within a FrameProvider")
  }
  return context
} 