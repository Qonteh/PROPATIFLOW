import React from "react"
import { Textarea } from "@/components/ui/textarea"

interface LeaseEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function LeaseEditor({ value, onChange, disabled }: LeaseEditorProps) {
  return (
    <Textarea
      className="w-full min-h-[220px] font-mono text-sm mb-4"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Edit your lease/contract template here..."
    />
  )
}
