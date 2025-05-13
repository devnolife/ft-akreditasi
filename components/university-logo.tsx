import Image from "next/image"

interface UniversityLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function UniversityLogo({ size = "md", showText = true }: UniversityLogoProps) {
  const sizeMap = {
    sm: { logo: 32, container: "h-8 w-8" },
    md: { logo: 40, container: "h-10 w-10" },
    lg: { logo: 48, container: "h-12 w-12" },
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative overflow-hidden ${sizeMap[size].container}`}>
        <Image src="/images/unismuh-logo.png" alt="Universitas Muhammadiyah Makassar" fill className="object-contain" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-sm">Fakultas Teknik</span>
          <span className="text-xs text-muted-foreground">Data Tracker</span>
        </div>
      )}
    </div>
  )
}
