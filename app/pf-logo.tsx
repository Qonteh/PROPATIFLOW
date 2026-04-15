import Image from "next/image"

export function PFLogo({ className = "", size = 160 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/pt_info.png"
      alt="Property Flow Logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  )
}
