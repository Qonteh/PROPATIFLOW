import React from "react"
import { Scale, Shield, FileText, Users, Calendar, Banknote, Stamp, Phone, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// SECTIONS and helpers will be imported or duplicated as needed

export const SECTIONS = [
  {
    number: "1",
    label: "Muda wa Mkataba / Term of Lease",
    value: "From ________________ to ________________",
    icon: Calendar,
  },
  {
    number: "2",
    label: "Kodi / Rent Amount",
    value: "________________ TZS per month, due on the ________________ of each month",
    icon: Banknote,
  },
  {
    number: "3",
    label: "Amana / Security Deposit",
    value: "________________ TZS",
    icon: Shield,
  },
  {
    number: "4",
    label: "Huduma / Utilities",
    value: "____________________________",
    icon: FileText,
  },
  {
    number: "5",
    label: "Matengenezo / Maintenance",
    value: "____________________________",
    icon: FileText,
  },
  {
    number: "6",
    label: "Adhabu ya Kuchelewa / Late Penalties",
    value: "____________________________",
    icon: Banknote,
  },
  {
    number: "7",
    label: "Sera ya Kupangisha Ndogo / Subletting",
    value: "____________________________",
    icon: Users,
  },
  {
    number: "8",
    label: "Notisi ya Kusitisha / Termination Notice",
    value: "____________________________",
    icon: FileText,
  },
  {
    number: "9",
    label: "Sheria na Kanuni / Rules & Regulations",
    value: "____________________________",
    icon: Scale,
  },
  {
    number: "10",
    label: "Utatuzi wa Migogoro / Dispute Resolution",
    value: "____________________________",
    icon: Scale,
  },
  {
    number: "11",
    label: "Sheria Inayotumika / Governing Law",
    value: "The Laws of the United Republic of Tanzania",
    icon: Shield,
  },
  {
    number: "12",
    label: "Masharti ya Ziada / Additional Terms",
    value: "____________________________",
    icon: FileText,
  },
]

function CoatOfArms() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/10">
        <Shield className="h-10 w-10 text-primary" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <div className="h-2 w-10 rounded-full bg-accent/60" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-px w-8 bg-primary/30" />
        <Scale className="h-3.5 w-3.5 text-primary/50" />
        <div className="h-px w-8 bg-primary/30" />
      </div>
    </div>
  )
}

function SignatureField({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="flex-1 border-b border-dotted border-foreground/20" />
    </div>
  )
}

function SignatureBlock({ role, swahili }: { role: string; swahili: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{role}</p>
          <p className="text-xs text-muted-foreground">{swahili}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <SignatureField label="Jina Kamili / Full Name:" />
        <SignatureField label="Simu / Phone:" icon={<Phone className="h-3 w-3" />} />
        <SignatureField label="Barua Pepe / Email:" icon={<Mail className="h-3 w-3" />} />
        <Separator className="my-1" />
        <SignatureField label="Sahihi / Signature:" icon={<Stamp className="h-3 w-3" />} />
        <SignatureField label="Tarehe / Date:" icon={<Calendar className="h-3 w-3" />} />
      </div>
    </div>
  )
}

function SectionRow({ number, label, value, icon: Icon, isLast }: { number: string; label: string; value: string; icon: React.ComponentType<{ className?: string }>; isLast: boolean }) {
  return (
    <div>
      <div className="flex items-start gap-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 pt-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-primary">{number}.</span>
            <span className="text-sm font-bold text-foreground">{label}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{value}</p>
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  )
}

export function PreviewCard() {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-lg">
      {/* Document Header */}
      <div className="relative border-b-2 border-primary/15 bg-gradient-to-b from-primary/5 to-transparent px-6 py-8 md:px-10">
        {/* Top decorative line */}
        <div className="absolute inset-x-6 top-0 flex items-center gap-2 md:inset-x-10">
          <div className="h-1 flex-1 rounded-b bg-primary/20" />
          <div className="h-1 w-8 rounded-b bg-accent/40" />
          <div className="h-1 flex-1 rounded-b bg-primary/20" />
        </div>
        <div className="flex flex-col items-center gap-4 pt-4">
          <CoatOfArms />
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">Jamhuri ya Muungano wa Tanzania</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">United Republic of Tanzania</p>
          </div>
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-primary/20" />
              <div className="h-1.5 w-1.5 rotate-45 bg-primary/30" />
              <div className="h-px flex-1 bg-primary/20" />
            </div>
          </div>
          <h2 className="font-serif text-xl font-bold uppercase tracking-wide text-foreground md:text-2xl">Mkataba wa Kupangisha Nyumba</h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Lease Agreement</p>
        </div>
        <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
          {"Mkataba huu umefanywa kati ya "}
          <span className="inline-block border-b border-dashed border-foreground/30 px-1 font-medium text-foreground">__________________________</span>
          {" (Mpangishaji / Landlord) na "}
          <span className="inline-block border-b border-dashed border-foreground/30 px-1 font-medium text-foreground">__________________________</span>
          {" (Mpangaji / Tenant) kwa mali iliyoko "}
          <span className="inline-block border-b border-dashed border-foreground/30 px-1 font-medium text-foreground">____________________________________________</span>
          .
        </p>
      </div>
      {/* Sections */}
      <div className="px-6 py-6 md:px-10">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Masharti ya Mkataba / Terms & Conditions</h3>
        </div>
        <div className="flex flex-col gap-0">
          {SECTIONS.map((section, i) => (
            <SectionRow
              key={section.number}
              number={section.number}
              label={section.label}
              value={section.value}
              icon={section.icon}
              isLast={i === SECTIONS.length - 1}
            />
          ))}
        </div>
      </div>
      {/* Witness Section */}
      <div className="border-t border-border bg-muted/30 px-6 py-5 md:px-10">
        <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Shahidi / Witness</p>
          <div className="mt-3 flex flex-col gap-2.5">
            <SignatureField label="Jina la Shahidi / Witness Name:" />
            <SignatureField label="Sahihi / Signature:" icon={<Stamp className="h-3 w-3" />} />
            <SignatureField label="Tarehe / Date:" icon={<Calendar className="h-3 w-3" />} />
          </div>
        </div>
      </div>
      {/* Signatures */}
      <div className="border-t-2 border-primary/15 bg-muted/20 px-6 py-6 md:px-10">
        <div className="mb-5 flex items-center gap-2">
          <Stamp className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Sahihi za Pande Zote / Signatures</h3>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <SignatureBlock role="Landlord" swahili="Mpangishaji" />
          <SignatureBlock role="Tenant" swahili="Mpangaji" />
        </div>
      </div>
      {/* Footer */}
      <div className="border-t border-primary/15 bg-primary/5 px-6 py-3 md:px-10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">Chini ya Sheria za Jamhuri ya Muungano wa Tanzania</p>
          <p className="text-[10px] text-muted-foreground">Under the Laws of the United Republic of Tanzania</p>
        </div>
      </div>
    </div>
  )
}
