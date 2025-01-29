"use client"
import "@/styles/globals.css"
import { useState, useRef, useEffect } from "react"
import { Upload } from "lucide-react"
import Cropper from 'react-easy-crop'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"
import { useFrame } from "@/contexts/FrameContext"
import { DownloadForm } from "@/components/download-form"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "@/hooks/use-session"

interface FrameConfig {
  text: string
  textColor: string
  backgroundColor: string
  textSize: number
  image: string | null
  campaignName: string
}

interface CroppedAreaPixels {
  width: number
  height: number
  x: number
  y: number
}

interface Campaign {
  id: string
  name: string
}

export function ProfileFrameGenerator() {
  const { sessionData, saveSession, incrementDownloadCount } = useSession()
  const [frameConfig, setFrameConfig] = useState<FrameConfig>({
    text: "The Arc Of Essence",
    textColor: "#FFFFFF",
    backgroundColor: "#2E2A94",
    textSize: 24,
    image: null,
    campaignName: ""
  })
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rawImage, setRawImage] = useState<string | null>(null)
  const { setUploadedImage, setCroppedImage } = useFrame()
  const [showDownloadForm, setShowDownloadForm] = useState(false)

  const campaigns: Campaign[] = [
    { id: '1', name: 'The Arc Of Essence' },
    // { id: '2', name: 'Think Equity' },
    // { id: '3', name: 'MO Investor' },
    // Add more campaigns as needed
  ]

  const generateFrame = async () => {
    if (!frameConfig.image) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    // Create circular clipping path
    ctx.beginPath()
    ctx.arc(200, 200, 190, 0, 2 * Math.PI)
    ctx.clip()

    // Load and draw base image
    const img = new Image()
    img.src = frameConfig.image

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

        // Prepare text with formatting
        const displayText = frameConfig.text
        ctx.font = `bold ${frameConfig.textSize}px Poppins`

        // Calculate the total angle for the text arc
        const totalTextWidth = ctx.measureText(displayText).width
        const letterSpacing = frameConfig.textSize * 0.15 // or 24 * 0.15 for preset grid
        const totalWidth = totalTextWidth + (letterSpacing * (displayText.length - 1))
        const radius = 175

        // Calculate arc dimensions
        const circumference = 2 * Math.PI * radius
        const textArcLength = (totalWidth / circumference) * (2 * Math.PI)
        const centerPosition = Math.PI * 0.75
        const textStartAngle = centerPosition + (textArcLength / 2)
        const textEndAngle = centerPosition - (textArcLength / 2)

        // Add fade segments
        const fadeLength = 0.3
        const extendedStartAngle = textStartAngle + fadeLength
        const extendedEndAngle = textEndAngle - fadeLength

        // Draw main solid background
        ctx.beginPath()
        ctx.arc(200, 200, 180, textStartAngle, extendedEndAngle, true)
        ctx.lineWidth = 60
        ctx.strokeStyle = frameConfig.backgroundColor
        ctx.stroke()

        // Draw fade-out segment at start
        const startGradient = ctx.createLinearGradient(
          200 + radius * Math.cos(extendedStartAngle),
          200 + radius * Math.sin(extendedStartAngle),
          200 + radius * Math.cos(textStartAngle),
          200 + radius * Math.sin(textStartAngle)
        )
        startGradient.addColorStop(0, 'transparent')
        startGradient.addColorStop(1, frameConfig.backgroundColor)

        ctx.beginPath()
        ctx.arc(200, 200, 180, extendedStartAngle, textStartAngle, true)
        ctx.strokeStyle = startGradient
        ctx.stroke()

        // Draw fade-out segment at end
        const endGradient = ctx.createLinearGradient(
          200 + radius * Math.cos(extendedEndAngle),
          200 + radius * Math.sin(extendedEndAngle),
          200 + radius * Math.cos(textEndAngle),
          200 + radius * Math.sin(textEndAngle)
        )
        endGradient.addColorStop(0, frameConfig.backgroundColor)
        endGradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(200, 200, 180, textEndAngle, extendedEndAngle, true)
        ctx.strokeStyle = endGradient
        ctx.stroke()

        // Draw text
        ctx.fillStyle = frameConfig.textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.save()
        ctx.translate(200, 200)

        // When drawing the text, apply consistent spacing
        for (let i = 0; i < displayText.length; i++) {
            // Calculate the position for each character including letter spacing
            const charWidth = ctx.measureText(displayText[i]).width
            const spacingOffset = i * letterSpacing
            const currentPos = (spacingOffset + (ctx.measureText(displayText.substring(0, i)).width))
            const angle = textStartAngle - ((currentPos + charWidth/2) / radius)
            
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

    setGeneratedImage(canvas.toDataURL('image/png'))
  }

  const adjustColorWithAlpha = (color: string, alpha: number): string => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setRawImage(imageData)
        setUploadedImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async (croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    if (!rawImage) return
    
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const image = new Image()
    image.src = rawImage

    await new Promise((resolve) => {
      image.onload = () => {
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          400,
          400
        )
        
        const croppedImageData = canvas.toDataURL('image/png')
        setCroppedImage(croppedImageData)
        setFrameConfig(prev => ({
          ...prev,
          image: croppedImageData
        }))
        resolve(null)
      }
    })
  }

  const handleDownload = (format: string) => {
    if (!generatedImage) return;

    if (sessionData) {
      // User has already filled the form before
      downloadImage();
      incrementDownloadCount();
    } else {
      // First time user - show form
      setShowDownloadForm(true);
    }
  };

  const handleFormSubmit = async (formData: { name: string; email: string; whatsapp: string }) => {
    // Save session data for future downloads
    saveSession({
      ...formData,
      downloadCount: 0
    });
    
    // Proceed with download
    downloadImage();
    await incrementDownloadCount();
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `profile-frame-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpscale = async () => {
    if (!generatedImage) return
    
    // Create a new canvas with 2x dimensions
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800  // 2x original width
    canvas.height = 800 // 2x original height

    // Load current image
    const img = new Image()
    img.src = generatedImage

    await new Promise((resolve) => {
      img.onload = () => {
        // Draw the image at 2x size
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // Update the generated image with upscaled version
        setGeneratedImage(canvas.toDataURL('image/png'))
        resolve(null)
      }
    })
  }

  const FrameOverlay = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Match dimensions with the download version
      canvas.width = 400;
      canvas.height = 400;

      // Make canvas transparent initially
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Prepare text with formatting
      const displayText = frameConfig.text
      ctx.font = `bold ${frameConfig.textSize}px Poppins`;

      // Calculate the total angle for the text arc
      const totalTextWidth = ctx.measureText(displayText).width
      const letterSpacing = frameConfig.textSize * 0.15 // or 24 * 0.15 for preset grid
      const totalWidth = totalTextWidth + (letterSpacing * (displayText.length - 1))
      const radius = 175;

      // Calculate arc dimensions
      const circumference = 2 * Math.PI * radius;
      const textArcLength = (totalWidth / circumference) * (2 * Math.PI);
      const centerPosition = Math.PI * 0.75;
      const textStartAngle = centerPosition + (textArcLength / 2);
      const textEndAngle = centerPosition - (textArcLength / 2);

      // Add fade segments
      const fadeLength = 0.3;
      const extendedStartAngle = textStartAngle + fadeLength;
      const extendedEndAngle = textEndAngle - fadeLength;

      // Draw main solid background
      ctx.beginPath();
      ctx.arc(200, 200, 180, textStartAngle, textEndAngle, true);
      ctx.lineWidth = 60;
      ctx.strokeStyle = frameConfig.backgroundColor;
      ctx.stroke();

      // Draw fade-out segment at start
      const startGradient = ctx.createLinearGradient(
        200 + radius * Math.cos(extendedStartAngle),
        200 + radius * Math.sin(extendedStartAngle),
        200 + radius * Math.cos(textStartAngle),
        200 + radius * Math.sin(textStartAngle)
      );
      startGradient.addColorStop(0, 'transparent');
      startGradient.addColorStop(0.1, 'transparent'); // Start fading at 40%
      startGradient.addColorStop(0.8, frameConfig.backgroundColor); // Solid color by 70%
      startGradient.addColorStop(1, frameConfig.backgroundColor);

      ctx.beginPath();
      ctx.arc(200, 200, 180, extendedStartAngle, textStartAngle, true);
      ctx.strokeStyle = startGradient;
      ctx.stroke();

      // Draw fade-out segment at end
      const endGradient = ctx.createLinearGradient(
        200 + radius * Math.cos(textEndAngle),
        200 + radius * Math.sin(textEndAngle),
        200 + radius * Math.cos(extendedEndAngle),
        200 + radius * Math.sin(extendedEndAngle)
      );
      endGradient.addColorStop(0, frameConfig.backgroundColor);
      endGradient.addColorStop(0.2, frameConfig.backgroundColor); // Keep solid until 30%
      endGradient.addColorStop(0.9, 'transparent'); // Fade out by 60%
      endGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(200, 200, 180, textEndAngle, extendedEndAngle, true);
      ctx.strokeStyle = endGradient;
      ctx.stroke();

      // Draw text
      ctx.fillStyle = frameConfig.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.save();
      ctx.translate(200, 200);

      // When drawing the text, apply consistent spacing
      for (let i = 0; i < displayText.length; i++) {
          // Calculate the position for each character including letter spacing
          const charWidth = ctx.measureText(displayText[i]).width
          const spacingOffset = i * letterSpacing
          const currentPos = (spacingOffset + (ctx.measureText(displayText.substring(0, i)).width))
          const angle = textStartAngle - ((currentPos + charWidth/2) / radius)
          
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(angle - Math.PI / 2)
          ctx.fillText(displayText[i], 0, 0)
          ctx.restore()
      }

      ctx.restore();
    }, [frameConfig]);

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    );
  });

  FrameOverlay.displayName = 'FrameOverlay';

  useEffect(() => {
    if (frameConfig.image) {
      generateFrame()
    }
  }, [frameConfig])

  return (
    <div className="w-full max-w-[1202px] mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mt-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Controls */}
        <div className="w-full lg:w-[500px] flex flex-col gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="max-[485px]:!text-[24px] max-[485px]:!leading-[28px]" style={{ fontFamily: 'Butler', fontSize: '36px', fontWeight: '800', lineHeight: '48px', fontStyle: 'normal' }}>
              <span className="font-medium text-[#2E2A94]">Generate </span>
              <span className="font-bold bg-gradient-to-r from-[#fcae17] to-[#F7971E] bg-clip-text text-transparent">
                Profile Frames
              </span>
            </h1>
            <p className="text-base text-[#2E2A94] sm:text-lg lg:text-xl font-['Poppins'] font-medium leading-[24px]">
              Customize your Socials profile picture with a badge or frame in just a few clicks.
            </p>
          </div>

          {/* Controls Section */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Arc Text Input */}
            <div className="space-y-3">
              <Label 
                htmlFor="arc-text"
                className="block text-[#2E2A94] text-sm sm:text-base font-semibold"
              >
                Arc Text
              </Label>
              <div className="relative">
                <select
                  id="campaign-name"
                  value={frameConfig.campaignName}
                  onChange={(e) => setFrameConfig(prev => ({ 
                    ...prev, 
                    campaignName: e.target.value,
                    text: e.target.value || "The Arc Of Essence" // Use default text if no campaign selected
                  }))}
                  className="w-full h-12 sm:h-14 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.1)] 

                            rounded-xl px-4 sm:px-5 text-sm sm:text-base transition-all duration-200 
                            hover:bg-[rgba(0,0,0,0.03)] focus:ring-2 focus:ring-yellow-400/50 
                            focus:border-yellow-400 appearance-none"
                >
                  {/* <option value="">Select Campaign</option> */}
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.name}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              {/* <Input
                id="arc-text"
                value={frameConfig.text}
                onChange={(e) => setFrameConfig(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter text for the arc"
                className="w-full h-12 sm:h-14 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.1)] 
                          rounded-xl px-4 sm:px-5 text-sm sm:text-base transition-all duration-200 
                          hover:bg-[rgba(0,0,0,0.03)] focus:ring-2 focus:ring-yellow-400/50 
                          focus:border-yellow-400"
              /> */}
            </div>

            {/* Color Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Arc Color */}
              <div className="space-y-3">
                <Label 
                  htmlFor="background-color"
                  className="block text-[#2E2A94] text-sm sm:text-base font-semibold"
                >
                  Arc Color
                </Label>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[rgba(0,0,0,0.02)] 
                              border border-[rgba(0,0,0,0.1)] rounded-xl transition-all duration-200 
                              hover:bg-[rgba(0,0,0,0.03)]">
                  <div className="relative group">
                    <Input
                      id="background-color"
                      type="color"
                      value={frameConfig.backgroundColor}
                      onChange={(e) => setFrameConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg border-none cursor-pointer 
                                transition-transform duration-200 group-hover:scale-110 
                                focus:ring-2 focus:ring-yellow-400/50"
                    />
                    <div className="absolute inset-0 rounded-lg shadow-sm pointer-events-none" />
                  </div>
                  <span className="font-medium text-[#363636] text-sm sm:text-base">
                    {frameConfig.backgroundColor.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-3">
                <Label 
                  htmlFor="text-color"
                  className="block text-[#2E2A94] text-sm sm:text-base font-semibold"
                >
                  Text Color
                </Label>
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[rgba(0,0,0,0.02)] 
                              border border-[rgba(0,0,0,0.1)] rounded-xl transition-all duration-200 
                              hover:bg-[rgba(0,0,0,0.03)]">
                  <div className="relative group">
                    <Input
                      id="text-color"
                      type="color"
                      value={frameConfig.textColor}
                      onChange={(e) => setFrameConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg border-none cursor-pointer 
                                transition-transform duration-200 group-hover:scale-110 
                                focus:ring-2 focus:ring-yellow-400/50"
                    />
                    <div className="absolute inset-0 rounded-lg shadow-sm pointer-events-none" />
                  </div>
                  <span className="font-medium text-[#363636] text-sm sm:text-base">
                    {frameConfig.textColor.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 
                      mt-6 lg:mt-0 px-4 sm:px-0">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[340px] lg:h-[340px] 
                        rounded-full overflow-hidden shadow-xl">
            {rawImage ? (
              <div className="relative w-full h-full animate-fade-in">
                <Cropper
                  image={rawImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  objectFit="cover"
                  cropSize={{ 
                    width: window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 340,
                    height: window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 340
                  }}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  zoomWithScroll={true}
                />
                <FrameOverlay />
              </div>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.02)] 
                          cursor-pointer transition-all duration-300 hover:bg-[rgba(0,0,0,0.04)] group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Button 
                  variant="outline" 
                  className="gap-2 sm:gap-3 text-base sm:text-lg font-medium bg-white/80 
                            hover:bg-white/90 transition-all duration-300 group-hover:scale-105"
                >
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  Upload Image
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Download Button */}
          <button
            onClick={() => handleDownload('png')}
            disabled={!generatedImage}
            className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[360px] h-12 sm:h-14 
                     rounded-xl font-bold text-[#232323] text-base sm:text-lg
                     bg-gradient-to-r from-[#FFD200] to-[#F7971E] 
                     transition-all duration-300 hover:opacity-90 hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform hover:-translate-y-0.5"
          >
            Download Frame
          </button>
        </div>
      </div>
      <DownloadForm 
        open={showDownloadForm} 
        onOpenChange={setShowDownloadForm}
        onSubmit={(formData: { name: string; email: string; whatsapp: string }) => handleFormSubmit(formData)}
      />
    </div>
  )
}

