import React from "react"
import { Button } from "@/components/ui/button"

interface PaymentCardProps {
  onPay: () => void
  onCancel: () => void
}

export function PaymentCard({ onPay, onCancel }: PaymentCardProps) {
  return (
    <div className="mt-8 p-6 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-900 flex flex-col items-center">
      <div className="font-bold text-lg mb-2">One-Time Customization Fee</div>
      <div className="mb-4 text-sm text-center">
        Pay <span className="font-semibold">TZS 10,000</span> to unlock template editing for your account.<br />
        This is a one-time payment. After payment, you can edit your lease template anytime.
      </div>
      <Button className="mb-2 w-full" onClick={onPay}>
        Pay Now
      </Button>
      <Button variant="ghost" className="w-full" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
