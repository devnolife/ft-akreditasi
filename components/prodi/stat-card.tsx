import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          {description && <CardDescription>{description}</CardDescription>}
          {trend && (
            <div
              className={`flex items-center text-xs font-medium ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
              }`}
            >
              {trend === "up" ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : trend === "down" ? (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              ) : (
                <MinusIcon className="h-3 w-3 mr-1" />
              )}
              {trendValue}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
