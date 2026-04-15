import Image from "next/image"

export function PFLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/pt_info.png"
      alt="Property Flow Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
