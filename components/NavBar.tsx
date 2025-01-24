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
  return (
    <header className="bg-black p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="images/motilal-oswal-logo.png"
            alt="Motilal Oswal"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
          <div className="h-5 w-px bg-gray-600" />
          <p className="text-[#F8FAFC] font-mono text-[20px] font-normal font-600 leading-[28px] tracking-[-0.5px]">
            SnapFrame
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-white hover:text-yellow-400">
            Home
          </Link>
          <Link href="/presets" className="text-white hover:text-yellow-400">
            Presets
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] bg-black">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-white hover:text-yellow-400">
                Home
              </Link>
              <Link href="/presets" className="text-white hover:text-yellow-400">
                Presets
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
