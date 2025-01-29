"use client"
import "@/styles/globals.css"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "./ui/sheet"

export function Navbar() {
  const scrollToPresets = () => {
    document.getElementById('presets')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2E2A94] backdrop-blur-sm p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 transition-all duration-300 hover:opacity-80">
          <Image
            src="/images/Motilal new logo.svg"
            alt="Motilal Oswal"
            width={120}
            height={40}
            className="h-8 w-auto sm:h-10 transition-transform duration-300 hover:scale-105"
          />
          <div className="h-6 w-px bg-gray-600 hidden sm:block" />
          {/* <Image
            src="/images/favicon-32x32.png"
            alt="Motilal Oswal"
            width={20}
            height={20}
            className="h-8 w-auto sm:h-10 transition-transform duration-300 hover:scale-105"
          /> */}
          <p className="text-[#F8FAFC] font-mono text-lg sm:text-xl font-semibold tracking-tight">
            SnapFrame
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link 
            href="/" 
            className="text-white hover:text-yellow-400 transition-colors duration-300 text-sm font-medium"
          >
            Home
          </Link>
          {/* <button
            onClick={scrollToPresets}
            className="text-white hover:text-yellow-400 transition-colors duration-300 text-sm font-medium"
          >
            Presets
          </button> */}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] bg-black">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-white hover:text-yellow-400">
                Home
              </Link>
              <button
                onClick={scrollToPresets}
                className="text-white hover:text-yellow-400 text-left"
              >
                Presets
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
