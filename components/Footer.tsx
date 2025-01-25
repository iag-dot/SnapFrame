import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t h-[40px]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between h-[60px] gap-2 sm:gap-0">
        <Image
          src="images/motilal-oswal-logo.png"
          alt="SnapFrame"
          width={100}
          height={40}
          className="h-5 w-auto sm:h-6"
        />
        <p className="text-xs sm:text-sm text-gray-500">© SnapFrame. All rights reserved.</p>
      </div>
    </footer>
  );
};