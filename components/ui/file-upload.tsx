"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Image as ImageIcon, File, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  onRemove?: () => void
  className?: string
  maxSize?: number // in MB
  allowedTypes?: string[]
  aspectRatio?: number // width/height ratio
  maxWidth?: number
  maxHeight?: number
  preview?: boolean
  multiple?: boolean
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
}

interface FileValidation {
  isValid: boolean
  error?: string
  dimensions?: { width: number; height: number }
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  className,
  maxSize: _maxSize = 5, // size limits removed; kept for API compatibility
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  aspectRatio: _aspectRatio,
  maxWidth: _maxWidth,
  maxHeight: _maxHeight,
  preview = true,
  multiple = false,
  label,
  description,
  required = false,
  disabled = false,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(async (file: File): Promise<FileValidation> => {
    // Check file type only — size, dimensions, and aspect ratio are not restricted
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Accepted: ${allowedTypes
          .map(type => type.split('/')[1].toUpperCase())
          .join(', ')}`
      }
    }

    return { isValid: true }
  }, [allowedTypes])

  const handleFiles = useCallback(async (files: FileList) => {
    if (disabled) return
    
    setError(null)
    setIsLoading(true)
    setUploadProgress(0)

    const file = files[0] // Take first file
    if (!file) {
      setIsLoading(false)
      return
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    const validation = await validateFile(file)
    
    if (!validation.isValid) {
      setError(validation.error || "File validation failed")
      setIsLoading(false)
      setUploadProgress(0)
      clearInterval(progressInterval)
      return
    }

    setUploadProgress(100)
    setTimeout(() => {
      onChange(file)
      setIsLoading(false)
      setUploadProgress(0)
      clearInterval(progressInterval)
    }, 200)
  }, [validateFile, onChange, disabled])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles, disabled])

  const handleRemove = useCallback(() => {
    if (disabled) return
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }, [onChange, onRemove, disabled])

  const openFileDialog = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const getPreviewUrl = useCallback((file: string | File): string | null => {
    if (typeof file === 'string') return file
    if (file instanceof File) return URL.createObjectURL(file)
    return null
  }, [])

  const getFileTypeDisplay = () => {
    return allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
  }

  const getResolutionDisplay = () => null

  const getAspectRatioDisplay = () => null

  const previewUrl = value ? getPreviewUrl(value) : null
  const hasFile = Boolean(value)
  const isImage = hasFile && (typeof value === 'string' || (value instanceof File && value.type?.startsWith('image/')))

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}

      <div className="relative">
        {/* Upload Button Area */}
        {!hasFile && (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              disabled={disabled || isLoading}
              className="w-full h-12 border-dashed border-2 hover:border-gray-400 dark:hover:border-gray-500"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 animate-pulse" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </div>
              )}
            </Button>

            {/* Restrictions Display */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div className="flex flex-wrap gap-4">
                <span>Formats: {getFileTypeDisplay()}</span>
              </div>
              {(getResolutionDisplay() || getAspectRatioDisplay()) && (
                <div className="flex flex-wrap gap-4">
                  {getResolutionDisplay() && <span>{getResolutionDisplay()}</span>}
                  {getAspectRatioDisplay() && <span>{getAspectRatioDisplay()}</span>}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center text-gray-500">{uploadProgress}%</p>
              </div>
            )}
          </div>
        )}

        {/* Clean Preview Area */}
        {hasFile && (
          <div className="space-y-3">
            {/* Preview */}
            {isImage && preview && previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg border"
                  onLoad={() => {
                    if (value instanceof File) {
                      URL.revokeObjectURL(previewUrl!)
                    }
                  }}
                />
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {typeof value === 'string' 
                      ? value.split('/').pop() || 'Uploaded file'
                      : value?.name || 'Selected file'
                    }
                  </p>
                  {value instanceof File && (
                    <p className="text-xs text-green-600 dark:text-green-300">
                      {(value.size / 1024 / 1024).toFixed(2)} MB • {value.type}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Remove Button */}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Change File Button */}
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                className="w-full"
              >
                Change File
              </Button>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
