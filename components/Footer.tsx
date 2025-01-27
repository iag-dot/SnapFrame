import Image from "next/image"
import "@/styles/globals.css"
export function Footer() {
  return (
    <footer className="border-t h-[40px]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between h-[60px] gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Image
            src="/images/favicon-32x32.png"
            alt="SnapFrame"
            width={100}
            height={40}
            className="h-5 w-auto sm:h-6"
          />
          <p>SnapFrame</p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500">© SnapFrame. All rights reserved.</p>
      </div>
    </footer>
  );
};