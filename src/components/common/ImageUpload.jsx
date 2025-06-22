"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import Button from "./Button"

const ImageUpload = ({ currentImage, onImageChange, className = "" }) => {
  const [preview, setPreview] = useState(currentImage)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setPreview(imageUrl)
        onImageChange(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

      {preview ? (
        <div className="relative group">
          <img
            src={preview || "/placeholder.svg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <button
                onClick={triggerFileInput}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                title="Change photo"
              >
                <Camera size={16} />
              </button>
              <button
                onClick={handleRemoveImage}
                className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100 transition-colors"
                title="Remove photo"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`w-32 h-32 rounded-full border-4 border-dashed mx-auto flex items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="text-center">
            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-600">Upload Photo</p>
            <p className="text-xs text-gray-400">Drag & drop or click</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <Button variant="outline" size="sm" onClick={triggerFileInput}>
          <Camera size={16} className="mr-2" />
          {preview ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>
    </div>
  )
}

export default ImageUpload
