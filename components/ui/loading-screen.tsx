import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20">
      <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-background shadow-lg">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-center">{message}</p>
      </div>
    </div>
  )
}
