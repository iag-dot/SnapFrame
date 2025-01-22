import Image from "next/image"
import Link from "next/link"

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
        <p className="text-[#F8FAFC] font-mono font-20px font-normal font-600 leading-[28px] tracking-[-0.5px]">
          SnapFrame
        </p>
        </div>
        <nav className="flex gap-6">
          <Link href="/" className="text-white hover:text-yellow-400">
            Home
          </Link>
          <Link href="/presets" className="text-white hover:text-yellow-400">
            Presets
          </Link>
        </nav>
      </div>
    </header>
  )
}
