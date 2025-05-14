"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { DocumentUploader } from "@/components/document/document-uploader"
import { Loader2, Upload, ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import type { DocumentCategory } from "@/types/document"

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  name: string
  label: string
  type: "text" | "textarea" | "number" | "email" | "select" | "checkbox" | "date" | "file"
  placeholder?: string
  required?: boolean
  options?: FormFieldOption[]
  multiple?: boolean
  description?: string
}

interface FormBuilderProps {
  fields: FormField[]
  onSubmit: (data: any) => void
  documentCategory: DocumentCategory
  relatedItemId?: string
  submitLabel?: string
  initialData?: any
}

export function FormBuilder({
  fields,
  onSubmit,
  documentCategory,
  relatedItemId,
  submitLabel = "Submit",
  initialData = {},
}: FormBuilderProps) {
  const [formData, setFormData] = useState<any>(initialData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({})

  // Initialize form data with initial values
  useEffect(() => {
    // Only update if initialData is different from current formData
    const initialFormDataStr = JSON.stringify(initialData);
    const currentFormDataStr = JSON.stringify(formData);

    if (initialFormDataStr !== currentFormDataStr) {
      const initialFormData = { ...initialData };
      setFormData(initialFormData);

      // Set image previews for existing images
      const previews: Record<string, string> = {};
      fields.forEach((field) => {
        if (field.type === "file" && field.name.includes("Image") && initialData[field.name]) {
          previews[field.name] = initialData[field.name];
        }
      });

      if (Object.keys(previews).length > 0) {
        setImagePreview(previews);
      }
    }
  }, [initialData, fields, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    let parsedValue = value

    // Convert number inputs to numbers
    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value).toString()
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: parsedValue,
    }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => {
      // Only update if the value actually changed
      if (prev[name] === value) {
        return prev;
      }
      return {
        ...prev,
        [name]: value,
      };
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: date,
    }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setImagePreview((prev) => ({
          ...prev,
          [fieldName]: imageUrl,
        }))

        // In a real app, you would upload the file to your server here
        // and get back a URL to store in formData
        setFormData((prev: any) => ({
          ...prev,
          [fieldName]: imageUrl,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name]
        if (value === undefined || value === null || value === "") {
          newErrors[field.name] = `${field.label} is required`
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          // Handle image upload fields
          if (field.type === "file" && field.name.includes("Image")) {
            return (
              <div key={field.name} className="col-span-full">
                <Label htmlFor={field.name} className="mb-2 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>

                <div className="mt-2">
                  {imagePreview[field.name] ? (
                    <div className="relative w-full max-w-md mx-auto">
                      <Card className="overflow-hidden">
                        <div className="aspect-video relative">
                          <Image
                            src={imagePreview[field.name] || "/placeholder.svg"}
                            alt={field.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 flex justify-end">
                          <label htmlFor={`${field.name}-upload`} className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Change Image
                            </Button>
                            <input
                              id={`${field.name}-upload`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, field.name)}
                            />
                          </label>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor={`${field.name}-upload`}
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-10 h-10 mb-3 text-slate-400" />
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF</p>
                          {field.description && <p className="mt-1 text-xs text-slate-400">{field.description}</p>}
                        </div>
                        <input
                          id={`${field.name}-upload`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, field.name)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          // Handle regular file upload fields
          if (field.type === "file" && !field.name.includes("Image")) {
            return (
              <div key={field.name} className="col-span-full">
                <Label htmlFor={field.name} className="mb-2 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="mt-2">
                  <DocumentUploader
                    category={documentCategory}
                    relatedItemId={relatedItemId}
                    multiple={field.multiple}
                  />
                  {field.description && <p className="mt-1 text-xs text-slate-500">{field.description}</p>}
                </div>
              </div>
            )
          }

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="col-span-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            )
          }

          if (field.type === "select") {
            return (
              <div key={field.name} className="col-span-1">
                <Label htmlFor={field.name} className="mb-2 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange(field.name, value)}
                  value={formData[field.name] || undefined}
                >
                  <SelectTrigger id={field.name} className={errors[field.name] ? "border-red-500" : ""}>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
              </div>
            )
          }

          if (field.type === "checkbox") {
            return (
              <div key={field.name} className="col-span-1 flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={formData[field.name] || false}
                  onCheckedChange={(checked) => handleCheckboxChange(field.name, checked as boolean)}
                />
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
            )
          }

          if (field.type === "date") {
            return (
              <div key={field.name} className="col-span-1">
                <Label htmlFor={field.name} className="mb-2 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <DatePicker
                  date={formData[field.name] ? new Date(formData[field.name]) : undefined}
                  setDate={(date) => handleDateChange(field.name, date as Date | null)}
                />
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
              </div>
            )
          }

          // For simplicity, render all other fields as text inputs
          return (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type === "number" ? "number" : "text"}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
