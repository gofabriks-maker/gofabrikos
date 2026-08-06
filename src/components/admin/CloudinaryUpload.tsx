'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, ImagePlus, Loader2, CheckCircle } from 'lucide-react'

interface UploadedImage {
  url: string
  publicId: string
  width: number
  height: number
}

interface CloudinaryUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxImages?: number
  folder?: string
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'muaprkqa'
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'gofabrikos_products'

export default function CloudinaryUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder = 'gofabrikos/products',
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [images, setImages] = useState<UploadedImage[]>(
    value.map(url => ({ url, publicId: '', width: 800, height: 800 }))
  )

  const uploadToCloudinary = async (file: File): Promise<UploadedImage> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    }
  }

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const remaining = maxImages - images.length
      const toUpload = fileArray.slice(0, remaining)

      if (toUpload.length === 0) return

      setUploading(true)
      const newImages: UploadedImage[] = []

      for (let i = 0; i < toUpload.length; i++) {
        const file = toUpload[i]
        setUploadProgress(`Uploading ${i + 1} of ${toUpload.length}…`)
        try {
          const uploaded = await uploadToCloudinary(file)
          newImages.push(uploaded)
        } catch (err) {
          console.error('Upload error:', err)
        }
      }

      const updated = [...images, ...newImages]
      setImages(updated)
      onChange?.(updated.map(img => img.url))
      setUploading(false)
      setUploadProgress('')
    },
    [images, maxImages, onChange]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx)
    setImages(updated)
    onChange?.(updated.map(img => img.url))
  }

  const canUploadMore = images.length < maxImages && !uploading

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <Image
                src={img.url}
                alt={`Product image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 25vw"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <X size={12} />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {canUploadMore && (
        <label
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-rose-50 transition-colors"
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleInputChange}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 size={32} className="text-primary animate-spin mb-2" />
              <p className="text-sm text-gray-600 font-medium">{uploadProgress}</p>
            </>
          ) : (
            <>
              <ImagePlus size={32} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Drop images here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, WebP · Max 5MB each · {maxImages - images.length} slot{maxImages - images.length !== 1 ? 's' : ''} remaining
              </p>
            </>
          )}
        </label>
      )}

      {images.length >= maxImages && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <CheckCircle size={12} className="text-green-500" />
          Maximum {maxImages} images uploaded
        </p>
      )}
    </div>
  )
}
