import Image from "next/image"
import "@/styles/globals.css"

export function Footer() {
  return (
    <footer className="border-t bg-white h-[60px]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between h-full gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          {/* <Image
            src="/images/favicon-32x32.png"
            alt="SnapFrame"
            width={100}
            height={40}
            className="h-5 w-auto sm:h-6"
          /> */}
          <p>Arc of Essence Frame Generator</p>
        </div>
        {/* <p className="text-xs sm:text-sm text-gray-500"></p> */}
      </div>
    </footer>
  );
}