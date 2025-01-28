"use client"
import "@/styles/globals.css"
import Image from "next/image"
import { useFrame } from "@/contexts/FrameContext"
import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { useSession } from "@/hooks/use-session"
import { DownloadForm } from "@/components/download-form"

const PRESET_CONFIGS = [
  {
    text: "The Man From Motilal Oswal",
    textColor: "#FFFFFF",
    backgroundColor: "#767777",
  },
  {
    text: "MO Investor",
    textColor: "#FFD700",
    backgroundColor: "#000000",
  },
  {
    text: "Knowledge First",
    textColor: "#FFFFFF",
    backgroundColor: "#1E3A8A",
  },
  {
    text: "Think Equity",
    textColor: "#000000",
    backgroundColor: "#FFA500",
  },
  {
    text: "Research Driven",
    textColor: "#FFFFFF",
    backgroundColor: "#2E7D32",
  },
  {
    text: "Wealth Creation",
    textColor: "#FFD700",
    backgroundColor: "#4A148C",
  },
]

export function PresetGrid() {
  const { sessionData, saveSession, incrementDownloadCount } = useSession()
  const { uploadedImage, croppedImage } = useFrame()
  const [presetImages, setPresetImages] = useState<string[]>(Array(6).fill(""))
  const [showDownloadForm, setShowDownloadForm] = useState(false)
  const [selectedPresetImage, setSelectedPresetImage] = useState<string | null>(null)

  useEffect(() => {
    if (croppedImage) {
      // Generate frames for each preset configuration
      PRESET_CONFIGS.forEach((config, index) => {
        generateFrame(croppedImage, config).then((frameImage) => {
          setPresetImages(prev => {
            const newImages = [...prev]
            newImages[index] = frameImage
            return newImages
          })
        })
      })
    }
  }, [croppedImage])

  const generateFrame = async (image: string, config: typeof PRESET_CONFIGS[0]) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ""

    canvas.width = 400
    canvas.height = 400

    // Create circular clipping path
    ctx.beginPath()
    ctx.arc(200, 200, 190, 0, 2 * Math.PI)
    ctx.clip()

    // Load and draw base image
    const img = new (window.Image)()
    img.src = image

    await new Promise((resolve) => {
      img.onload = () => {
        // Calculate image positioning to center and cover
        const size = Math.max(canvas.width, canvas.height)
        const scale = size / Math.min(img.width, img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (canvas.width - scaledWidth) / 2
        const y = (canvas.height - scaledHeight) / 2

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

        // Reference the text and frame logic from ProfileFrameGenerator
        const displayText = config.text.toUpperCase()
        ctx.font = `bold 24px Poppins`

        // Configure letter spacing
        const letterSpacing = 24 * 0.15
        const textWidth = ctx.measureText(displayText).width + (letterSpacing * (displayText.length - 1))
        const radius = 175

        // Calculate arc dimensions
        const circumference = 2 * Math.PI * radius
        const textArcLength = (textWidth / circumference) * (2 * Math.PI)
        const centerPosition = Math.PI * 0.75
        const textStartAngle = centerPosition + (textArcLength / 2)
        const textEndAngle = centerPosition - (textArcLength / 2)

        // Add fade segments
        const fadeLength = 0.3
        const extendedStartAngle = textStartAngle + fadeLength
        const extendedEndAngle = textEndAngle - fadeLength

        // Draw main solid background
        ctx.beginPath()
        ctx.arc(200, 200, 180, textStartAngle, textEndAngle, true)
        ctx.lineWidth = 60
        ctx.strokeStyle = config.backgroundColor
        ctx.stroke()

        // Draw fade-out segment at start
        const startGradient = ctx.createLinearGradient(
          200 + radius * Math.cos(extendedStartAngle),
          200 + radius * Math.sin(extendedStartAngle),
          200 + radius * Math.cos(textStartAngle),
          200 + radius * Math.sin(textStartAngle)
        )
        startGradient.addColorStop(0, 'transparent')
        startGradient.addColorStop(0.1, 'transparent')
        startGradient.addColorStop(0.8, config.backgroundColor)
        startGradient.addColorStop(1, config.backgroundColor)

        ctx.beginPath()
        ctx.arc(200, 200, 180, extendedStartAngle, textStartAngle, true)
        ctx.strokeStyle = startGradient
        ctx.stroke()

        // Draw fade-out segment at end
        const endGradient = ctx.createLinearGradient(
          200 + radius * Math.cos(textEndAngle),
          200 + radius * Math.sin(textEndAngle),
          200 + radius * Math.cos(extendedEndAngle),
          200 + radius * Math.sin(extendedEndAngle)
        )
        endGradient.addColorStop(0, config.backgroundColor)
        endGradient.addColorStop(0.2, config.backgroundColor)
        endGradient.addColorStop(0.9, 'transparent')
        endGradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(200, 200, 180, textEndAngle, extendedEndAngle, true)
        ctx.strokeStyle = endGradient
        ctx.stroke()

        // Draw text
        ctx.fillStyle = config.textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.save()
        ctx.translate(200, 200)

        const totalAngle = -(textArcLength) / (displayText.length - 1)
        for (let i = 0; i < displayText.length; i++) {
          const angle = textStartAngle + (i * totalAngle)
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(angle - Math.PI / 2)
          ctx.fillText(displayText[i], 0, 0)
          ctx.restore()
        }

        ctx.restore()
        resolve(null)
      }
    })

    return canvas.toDataURL('image/png')
  }

  const handlePresetDownload = (presetImage: string) => {
    if (sessionData) {
      // User has already filled the form before
      downloadImage(presetImage);
      incrementDownloadCount();
    } else {
      // First time user - show form
      setSelectedPresetImage(presetImage);
      setShowDownloadForm(true);
    }
  };

  const handleFormSubmit = async (formData: { name: string; email: string; whatsapp: string }) => {
    if (selectedPresetImage) {
      // Save session data for future downloads
      saveSession({
        ...formData,
        downloadCount: 0
      });
      
      // Proceed with download
      downloadImage(selectedPresetImage);
      await incrementDownloadCount();
      setShowDownloadForm(false);
    }
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement("a");
    link.download = `preset-frame-${Date.now()}.png`;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!uploadedImage) {
    return (
      <section className="space-y-8">
        {/* <h2 className="text-3xl font-semibold text-center">Upload an image to explore presets</h2> */}
      </section>
    )
  }

  return (
    <section id="presets" className="space-y-8">
      <h2 className="text-3xl font-semibold text-center">Explore Presets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presetImages.map((presetImage, i) => (
          <div 
            key={i} 
            className="bg-white rounded-lg p-6 shadow-sm relative"
          >
            <div className="w-48 h-48 mx-auto">
              {presetImage ? (
                <>
                  <Image
                    src={presetImage}
                    alt={`Preset ${i + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button
                    onClick={() => handlePresetDownload(presetImage)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 animate-pulse" />
              )}
            </div>
            <p className="text-center mt-4 font-medium text-gray-700">
              {PRESET_CONFIGS[i].text}
            </p>
          </div>
        ))}
      </div>
      <DownloadForm 
        open={showDownloadForm}
        onOpenChange={setShowDownloadForm}
        onSubmit={handleFormSubmit}
        sessionData={sessionData}
      />
    </section>
  )
}

