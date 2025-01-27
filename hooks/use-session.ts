import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const SESSION_KEY = 'download_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

interface SessionData {
  name: string
  whatsapp: string
  email: string
  timestamp: string
  downloadCount: number
}

export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      const timestamp = new Date(data.timestamp).getTime()
      const now = new Date().getTime()
      
      if (now - timestamp < SESSION_DURATION) {
        setSessionData(data)
      } else {
        localStorage.removeItem(SESSION_KEY)
      }
    }
  }, [])

  const saveSession = (data: Omit<SessionData, 'timestamp'>) => {
    const sessionData = {
      ...data,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    setSessionData(sessionData)
  }

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY)
    setSessionData(null)
  }

  const incrementDownloadCount = async () => {
    if (sessionData) {
      const newCount = (sessionData.downloadCount || 0) + 1
      const updatedSession = {
        ...sessionData,
        downloadCount: newCount
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
      setSessionData(updatedSession)

      // Update Firestore
      try {
        const userRef = doc(db, "users", sessionData.email)
        await setDoc(userRef, {
          name: sessionData.name,
          whatsapp: sessionData.whatsapp,
          email: sessionData.email,
          downloadCount: newCount,
          lastDownload: new Date().toISOString()
        }, { merge: true })
      } catch (error) {
        console.error("Error updating download count:", error)
      }
    }
  }

  return { sessionData, saveSession, clearSession, incrementDownloadCount }
} 