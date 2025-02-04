import Image from "next/image"
import { ProfileFrameGenerator } from "@/components/profile-frame-generator"
import { PresetGrid } from "@/components/preset-grid"
import { Campaign } from "@/components/campaign"
import { Navbar } from "@/components/NavBar"
import { FrameProvider } from "@/contexts/FrameContext"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <FrameProvider>
      <div className="flex flex-col min-h-screen bg-[#F3F6F8]">
        {/* Gradient background with glassmorphism */}
        <div className="absolute top-0 left-0 right-0 h-[400px] 
                      bg-gradient-to-r from-yellow-400/40 via-amber-300/40 to-yellow-200/40 
                      glass-morphism -z-10" />
        
        <Navbar />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-8 sm:space-y-16">
          <ProfileFrameGenerator />
          {/* <PresetGrid /> */}
          {/* <Campaign /> */}
        </main>
        {/* <Footer /> */}
      </div>
    </FrameProvider>
  )
}

