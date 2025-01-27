
import "@/styles/globals.css"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { toast } from "@/hooks/use-toast"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  whatsapp: z.string().min(10, "Please enter a valid WhatsApp number"),
  email: z.string().email("Please enter a valid email address")
})

interface DownloadFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: { name: string; email: string; whatsapp: string }) => void
  sessionData?: {
    name: string
    whatsapp: string
    email: string
  } | null
}

export function DownloadForm({ open, onOpenChange, onSubmit, sessionData }: DownloadFormProps) {
  const [formData, setFormData] = useState({
    name: sessionData?.name || "",
    whatsapp: sessionData?.whatsapp || "",
    email: sessionData?.email || ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when session data changes
  useEffect(() => {
    if (sessionData) {
      setFormData({
        name: sessionData.name,
        whatsapp: sessionData.whatsapp,
        email: sessionData.email
      })
    }
  }, [sessionData])

  const validateForm = () => {
    try {
      formSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check your input and try again.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "downloads"), {
        ...formData,
        timestamp: new Date().toISOString(),
        downloadedAt: new Date().toISOString()
      })

      console.log("Document written with ID: ", docRef.id)

      // Clear form
      setFormData({
        name: "",
        whatsapp: "",
        email: ""
      })

      // Trigger download
      onSubmit(formData)
      
      // Close dialog
      onOpenChange(false)
      
      toast({
        title: "Success!",
        description: "Your frame is being downloaded.",
      })
    } catch (error) {
      console.error("Error saving to Firestore:", error)
      let errorMessage = "Failed to submit form. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("permission-denied")) {
          errorMessage = "Too many download attempts. Please wait a minute and try again."
        } else if (error.message.includes("failed-precondition")) {
          errorMessage = "Invalid form data. Please check your inputs."
        } else if (error.message.includes("resource-exhausted")) {
          errorMessage = "Service temporarily unavailable. Please try again later."
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Frame</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="Enter your WhatsApp number"
              className={errors.whatsapp ? "border-red-500" : ""}
            />
            {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit & Download"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 