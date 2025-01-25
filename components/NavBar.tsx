"use client"

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
    <header className="bg-black p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="images/motilal-oswal-logo.png"
            alt="Motilal Oswal"
            width={120}
            height={40}
            className="h-6 w-auto sm:h-8"
          />
          <div className="h-5 w-px bg-gray-600 hidden sm:block" />
          <p className="text-[#F8FAFC] font-mono text-base sm:text-[20px] font-normal font-600 leading-[28px] tracking-[-0.5px]">
            SnapFrame
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-white hover:text-yellow-400">
            Home
          </Link>
          <button
            onClick={scrollToPresets}
            className="text-white hover:text-yellow-400"
          >
            Presets
          </button>
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
