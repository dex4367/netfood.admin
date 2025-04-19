"use client"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: color }} />
      <Input type="text" value={color} onChange={(e) => onChange(e.target.value)} className="w-32" />
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 cursor-pointer p-0"
      />
    </div>
  )
}
