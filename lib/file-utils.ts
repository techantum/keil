import { useState, useCallback } from "react"
// File and image utility functions

export interface ImageValidationOptions {
  maxSize?: number // in MB
  allowedTypes?: string[]
  aspectRatio?: number // width/height ratio
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
}

export interface ImageDimensions {
  width: number
  height: number
  aspectRatio: number
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  dimensions?: ImageDimensions
}

/**
 * Default validation options
 */
export const DEFAULT_IMAGE_OPTIONS: Required<ImageValidationOptions> = {
  maxSize: 5, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  aspectRatio: 0, // 0 means no aspect ratio restriction
  maxWidth: 1920,
  maxHeight: 1080,
  minWidth: 10,
  minHeight: 10,
}

/**
 * Validates file type and size
 */
export function validateFileBasics(
  file: File, 
  options: Partial<ImageValidationOptions> = {}
): ValidationResult {
  const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options }

  // Check file type
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Accepted types: ${opts.allowedTypes
        .map(type => type.split('/')[1].toUpperCase())
        .join(', ')}`
    }
  }

  return { isValid: true }
}

/**
 * Gets image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    const img = new Image()
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      }
      resolve(dimensions)
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validates image dimensions and aspect ratio.
 * Dimension / aspect / size limits are no longer enforced — always valid if the file loads.
 */
export async function validateImageDimensions(
  file: File,
  _options: Partial<ImageValidationOptions> = {}
): Promise<ValidationResult> {
  try {
    const dimensions = await getImageDimensions(file)
    return {
      isValid: true,
      dimensions
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid image file'
    }
  }
}

/**
 * Complete file validation (type only — size/dimensions unrestricted)
 */
export async function validateFile(
  file: File,
  options: Partial<ImageValidationOptions> = {}
): Promise<ValidationResult> {
  const basicValidation = validateFileBasics(file, options)
  if (!basicValidation.isValid) {
    return basicValidation
  }

  if (file.type.startsWith('image/')) {
    try {
      const dimensions = await getImageDimensions(file)
      return { isValid: true, dimensions }
    } catch {
      return { isValid: true }
    }
  }

  return { isValid: true }
}

/**
 * Generates a preview URL for a file
 */
export function generatePreviewUrl(file: File | string): string | null {
  if (typeof file === 'string') {
    return file
  }

  if (file instanceof File && file.type.startsWith('image/')) {
    return URL.createObjectURL(file)
  }

  return null
}

/**
 * Creates a resized image from an image file
 */
export function resizeImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file) // Return original file if not an image
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw resized image
      ctx?.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Failed to resize image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Creates a thumbnail from an image file
 */
export function createThumbnail(
  file: File,
  size: number = 150,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Make square thumbnail
      const minDimension = Math.min(img.width, img.height)
      
      canvas.width = size
      canvas.height = size

      // Calculate crop area (center crop)
      const cropX = (img.width - minDimension) / 2
      const cropY = (img.height - minDimension) / 2

      // Draw cropped and resized image
      ctx?.drawImage(
        img, 
        cropX, cropY, minDimension, minDimension,
        0, 0, size, size
      )

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(thumbnailFile)
          } else {
            reject(new Error('Failed to create thumbnail'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Gets file extension from filename or MIME type
 */
export function getFileExtension(file: File): string {
  // Try to get from filename first
  const nameExt = file.name.split('.').pop()?.toLowerCase()
  if (nameExt) return nameExt

  // Fallback to MIME type
  const mimeExtensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  }

  return mimeExtensions[file.type] || 'unknown'
}

/**
 * Utility to clean up blob URLs
 */
export function revokePreviewUrl(url: string | null): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Checks if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Gets common aspect ratios
 */
export const COMMON_ASPECT_RATIOS = {
  SQUARE: 1, // 1:1
  PORTRAIT: 3/4, // 3:4
  LANDSCAPE: 4/3, // 4:3
  WIDESCREEN: 16/9, // 16:9
  ULTRA_WIDE: 21/9, // 21:9
  GOLDEN: 1.618, // Golden ratio
} as const

/**
 * Gets aspect ratio name from value
 */
export function getAspectRatioName(ratio: number): string {
  const tolerance = 0.05
  
  for (const [name, value] of Object.entries(COMMON_ASPECT_RATIOS)) {
    if (Math.abs(ratio - value) < tolerance) {
      return name.toLowerCase().replace('_', ' ')
    }
  }
  
  return `${ratio.toFixed(2)}:1`
}

/**
 * Multiple file upload hook
 */
export function useMultipleFiles(maxFiles: number = 10) {
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const addFile = useCallback((file: File) => {
    setFiles(prev => {
      if (prev.length >= maxFiles) {
        return [...prev.slice(1), file] // Remove oldest, add newest
      }
      return [...prev, file]
    })
  }, [maxFiles])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setErrors(prev => prev.filter((_, i) => i !== index))
  }, [])

  const addError = useCallback((error: string) => {
    setErrors(prev => [...prev, error])
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const clearAll = useCallback(() => {
    setFiles([])
    setErrors([])
  }, [])

  return {
    files,
    errors,
    addFile,
    removeFile,
    addError,
    clearErrors,
    clearAll,
    setFiles,
  }
}
