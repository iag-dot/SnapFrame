import Image from "next/image"
export function Campaign() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-semibold text-center">Current Campaign</h2>
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SnapFrame%20Editor-02FXdrNpV6kUUwtdoVNzXxnmSJGBAQ.png"
          alt="Campaign"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-2xl font-medium">The Man From Motilal Oswal Is Back: The Film</h3>
        </div>
      </div>
    </section>
  )
}

