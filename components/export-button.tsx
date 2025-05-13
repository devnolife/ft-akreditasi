"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonProps {
  onExport: () => Promise<{ success: boolean; message: string }>
  label?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
  showDropdown?: boolean
  exportOptions?: Array<{
    label: string
    handler: () => Promise<{ success: boolean; message: string }>
  }>
}

export function ExportButton({
  onExport,
  label = "Ekspor",
  variant = "outline",
  size = "default",
  className = "",
  showIcon = true,
  showDropdown = false,
  exportOptions = [],
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await onExport()
      if (result.success) {
        toast({
          title: "Ekspor Berhasil",
          description: result.message,
          variant: "success",
        })
      } else {
        toast({
          title: "Ekspor Gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ekspor Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleOptionExport = async (handler: () => Promise<{ success: boolean; message: string }>) => {
    setIsExporting(true)
    try {
      const result = await handler()
      if (result.success) {
        toast({
          title: "Ekspor Berhasil",
          description: result.message,
          variant: "success",
        })
      } else {
        toast({
          title: "Ekspor Gagal",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ekspor Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  if (showDropdown && exportOptions.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengekspor...
              </>
            ) : (
              <>
                {showIcon && <FileSpreadsheet className="mr-2 h-4 w-4" />}
                {label}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {exportOptions.map((option, index) => (
            <DropdownMenuItem key={index} onClick={() => handleOptionExport(option.handler)} disabled={isExporting}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleExport} disabled={isExporting}>
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengekspor...
        </>
      ) : (
        <>
          {showIcon && <Download className="mr-2 h-4 w-4" />}
          {label}
        </>
      )}
    </Button>
  )
}
