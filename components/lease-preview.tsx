import React from "react"

// This component should preview the current lease template in a styled way.
// For now, it will just show the default template in a styled pre block.

interface LeasePreviewProps {
  template?: string
}

export function LeasePreview({ template }: LeasePreviewProps) {
  // If no template is passed, show a placeholder
  const content = template || `LEASE AGREEMENT\n\nThis Lease Agreement is made between __________________________ (Landlord) and __________________________ (Tenant) for the property located at _____________________________________________________________.\n\n1. Term of Lease: From ________________ to ________________\n2. Rent Amount: ________________ TZS per month, due on the ________________ of each month\n3. Security Deposit: ________________ TZS\n4. Utilities: ____________________________________________________________________________________________\n5. Maintenance Responsibilities: _________________________________________________________________________\n6. Late Payment Penalties: ______________________________________________________________________________\n7. Subletting Policy: ___________________________________________________________________________________\n8. Termination Notice: _________________________________________________________________________________\n9. Rules & Regulations: ________________________________________________________________________________\n10. Dispute Resolution: ________________________________________________________________________________\n11. Governing Law: ____________________________________________________________________________________\n12. Additional Terms: __________________________________________________________________________________\n\nLandlord Contact: __________________________   Phone/Email: __________________________\nTenant Contact: __________________________   Phone/Email: __________________________\n\nLandlord Signature: ________________________   Date: ________________\nTenant Signature: _________________________   Date: ________________\n`

  return (
    <div className="bg-muted rounded p-4 mb-4 border border-border/50">
      <div className="text-lg md:text-xl font-serif font-bold text-foreground mb-2">Lease Agreement Preview</div>
      <pre className="text-[13px] md:text-base font-serif text-foreground whitespace-pre-wrap leading-relaxed">{content}</pre>
    </div>
  )
}
