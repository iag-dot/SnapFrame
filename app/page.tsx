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
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
          <ProfileFrameGenerator />
          <PresetGrid />
          {/* <Campaign /> */}
        </main>
        <Footer />
      </div>
    </FrameProvider>
  )
}

