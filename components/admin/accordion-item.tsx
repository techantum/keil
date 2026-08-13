"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  id: string
  title: string
  subtitle?: string
  status?: {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  }
  summary: React.ReactNode
  details: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

const statusColors = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  secondary: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  outline: "border border-gray-200 dark:border-gray-700",
  success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
}

export function AccordionItem({
  id,
  title,
  subtitle,
  status,
  summary,
  details,
  onEdit,
  onDelete,
  className
}: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md dark:bg-gray-800 dark:border-gray-700", className)}>
      <CardContent className="p-0">
        {/* Collapsed View - Reduced padding */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* Arrow indicator */}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                  {title}
                </h3>
                {status && (
                  <Badge 
                    variant={status.variant}
                    className={cn(
                      "text-xs px-1.5 py-0.5",
                      statusColors[status.variant]
                    )}
                  >
                    {status.label}
                  </Badge>
                )}
              </div>
              
              {subtitle && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {subtitle}
                </p>
              )}
              
              {/* Summary info when collapsed */}
              {!isExpanded && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {summary}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-8 px-3 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 text-blue-600 border-blue-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="h-8 px-3 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Expanded View - Reduced padding */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
            {details}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
