import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t h-[40px]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[60px]">
            <Image
              src="images/motilal-oswal-logo.png"
              alt="SnapFrame"
              width={100}
              height={40}
            //   className="h-6 w-auto"
            />
            <p className="text-sm text-gray-500">© SnapFrame. All rights reserved.</p>
        </div>
    </footer>
  );
};