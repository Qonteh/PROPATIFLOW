"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Pencil,
  Send,
  Download,
  Lock,
  CheckCircle2,
  FileText,
  Shield,
  CreditCard,
  X,
  RotateCcw,
  Save,
  Sparkles,
  Scale,
  Building2,
  Users,
  Calendar,
  Banknote,
  MapPin,
  Phone,
  Mail,
  Stamp,
} from "lucide-react"

// Default template content
const DEFAULT_TEMPLATE = `1. KIPINDI CHA MKATABA / LEASE PERIOD
Mkataba huu utaanza tarehe ________________ na utaisha tarehe ________________.

2. KODI YA KUKODI / RENT AMOUNT
Mpangaji atalipa kiasi cha shilingi ________________ kwa mwezi (TZS ___________).

3. MALIPO YA DEPOSIT / DEPOSIT PAYMENT
Mpangaji atalipa deposit ya shilingi ________________ (TZS ___________) kabla ya kuingia nyumbani.

4. MATUMIZI YA NYUMBA / PROPERTY USE
Nyumba itatumika kwa makazi tu na si biashara yoyote isipokuwa kwa idhini ya mpangishaji.

5. MATENGENEZO / MAINTENANCE
Mpangaji atatunza nyumba vizuri na kutoa taarifa ya uharibifu wowote kwa mpangishaji.

6. MALIPO YA HUDUMA ZA MSINGI / UTILITIES
Mpangaji atalipa bili zote za maji, umeme, na taka.

7. KUKATISHA MKATABA / TERMINATION
Mkataba unaweza kukatishwa kwa taarifa ya siku 30 kwa maandishi kutoka kwa upande wowote.

8. UZALISHAJI MKATABA / RENEWAL
Mkataba utazalishwa kwa masharti yaleyale isipokuwa upande wowote utatoa taarifa ya kutozalisha.

9. MASHARTI MENGINE / OTHER TERMS
Mpangaji hataruhusiwa kukodi au kukopesha nyumba kwa mtu mwingine bila idhini ya mpangishaji.

10. SHERIA TUMIAI / GOVERNING LAW
Mkataba huu utatawaliwa na Sheria za Jamhuri ya Muungano wa Tanzania.`

// Section data
const SECTIONS = [
  {
    number: "1",
    label: "Kipindi cha Mkataba / Lease Period",
    value: "Mkataba huu utaanza tarehe ________________ na utaisha tarehe ________________.",
    icon: Calendar
  },
  {
    number: "2",
    label: "Kodi ya Kukodi / Rent Amount",
    value: "Mpangaji atalipa kiasi cha shilingi ________________ kwa mwezi (TZS ___________).",
    icon: Banknote
  },
  {
    number: "3",
    label: "Malipo ya Deposit / Deposit Payment",
    value: "Mpangaji atalipa deposit ya shilingi ________________ (TZS ___________) kabla ya kuingia nyumbani.",
    icon: CreditCard
  },
  {
    number: "4",
    label: "Matumizi ya Nyumba / Property Use",
    value: "Nyumba itatumika kwa makazi tu na si biashara yoyote isipokuwa kwa idhini ya mpangishaji.",
    icon: Building2
  },
  {
    number: "5",
    label: "Matengenezo / Maintenance",
    value: "Mpangaji atatunza nyumba vizuri na kutoa taarifa ya uharibifu wowote kwa mpangishaji.",
    icon: Shield
  },
  {
    number: "6",
    label: "Malipo ya Huduma za Msingi / Utilities",
    value: "Mpangaji atalipa bili zote za maji, umeme, na taka.",
    icon: Sparkles
  },
  {
    number: "7",
    label: "Kukatisha Mkataba / Termination",
    value: "Mkataba unaweza kukatishwa kwa taarifa ya siku 30 kwa maandishi kutoka kwa upande wowote.",
    icon: X
  },
  {
    number: "8",
    label: "Uzalishaji Mkataba / Renewal",
    value: "Mkataba utazalishwa kwa masharti yaleyale isipokuwa upande wowote utatoa taarifa ya kutozalisha.",
    icon: RotateCcw
  },
  {
    number: "9",
    label: "Masharti Mengine / Other Terms",
    value: "Mpangaji hataruhusiwa kukodi au kukopesha nyumba kwa mtu mwingine bila idhini ya mpangishaji.",
    icon: FileText
  },
  {
    number: "10",
    label: "Sheria Tumiai / Governing Law",
    value: "Mkataba huu utatawaliwa na Sheria za Jamhuri ya Muungano wa Tanzania.",
    icon: Scale
  }
]

/* ────────────────────────────────────────────────────────────────────────── */
/*  Signature Field                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────────────────────── */
/*  Signature Block                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────────────────────── */
/*  Section Row                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function SectionRow({
  number,
  label,
  value,
  icon: Icon,
  isLast,
}: {
  number: string
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  isLast: boolean
}) {
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
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {value}
          </p>
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Coat of Arms Component (replaces the missing import)                      */
/* ────────────────────────────────────────────────────────────────────────── */

function CoatOfArms() {
  return (
    <div className="flex justify-center">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary/60" />
          </div>
        </div>
        <div className="absolute -top-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary/20" />
        <div className="absolute -bottom-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary/20" />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Preview Card (The Main Document)                                           */
/* ────────────────────────────────────────────────────────────────────────── */

function PreviewCardComponent() {
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">
              Jamhuri ya Muungano wa Tanzania
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              United Republic of Tanzania
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-primary/20" />
              <div className="h-1.5 w-1.5 rotate-45 bg-primary/30" />
              <div className="h-px flex-1 bg-primary/20" />
            </div>
          </div>

          <h2 className="font-serif text-xl font-bold uppercase tracking-wide text-foreground md:text-2xl">
            Mkataba wa Kupangisha Nyumba
          </h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Lease Agreement
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-relaxed text-muted-foreground">
          {"Mkataba huu umefanywa kati ya "}
          <span className="inline-block border-b border-dashed border-foreground/30 px-1 font-medium text-foreground">
            __________________________
          </span>
          {" (Mpangishaji / Landlord) na "}
          <span className="inline-block border-b border-dashed border-foreground/30 px-1 font-medium text-foreground">
            __________________________
          </span>
          {" (Mpangaji / Tenant) kwa mali iliyoko "}
          <span className="inline-block border-b border-dashed border-foreground/30 px-1 font-medium text-foreground">
            ____________________________________________
          </span>
          .
        </p>
      </div>

      {/* Sections */}
      <div className="px-6 py-6 md:px-10">
        <div className="mb-4 flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
            Masharti ya Mkataba / Terms & Conditions
          </h3>
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
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Shahidi / Witness
          </p>
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
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">
            Sahihi za Pande Zote / Signatures
          </h3>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <SignatureBlock role="Landlord" swahili="Mpangishaji" />
          <SignatureBlock role="Tenant" swahili="Mpangaji" />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-primary/15 bg-primary/5 px-6 py-3 md:px-10">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            Chini ya Sheria za Jamhuri ya Muungano wa Tanzania
          </p>
          <p className="text-[10px] text-muted-foreground">
            Under the Laws of the United Republic of Tanzania
          </p>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Editor Card                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function EditorCard({
  template,
  hasPaid,
  onTemplateChange,
  onSave,
  onCancel,
  onReset,
}: {
  template: string
  hasPaid: boolean
  onTemplateChange: (val: string) => void
  onSave: () => void
  onCancel: () => void
  onReset: () => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-lg">
      <div className="border-b border-border bg-primary/5 px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Pencil className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Hariri Mkataba / Edit Template
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {hasPaid
                ? "Badilisha kila sehemu ya mkataba wako hapa chini."
                : "Lipa ili kufungua uwezo kamili wa kuhariri."}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 md:px-10">
        <Textarea
          className="min-h-[420px] resize-y border-border bg-muted/30 font-mono text-sm leading-relaxed"
          value={template}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onTemplateChange(e.target.value)
          }
          disabled={!hasPaid}
          placeholder="Maudhui ya mkataba wako..."
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4 md:px-10">
        <Button
          variant="ghost"
          onClick={onReset}
          className="gap-2 text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Rejesha Asili / Reset
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            Ghairi / Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!hasPaid}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Hifadhi / Save
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Payment Card                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

function PaymentCard({
  onPay,
  onCancel,
}: {
  onPay: () => void
  onCancel: () => void
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border-2 border-accent/30 bg-accent/5 shadow-md">
      <div className="flex items-center gap-3 border-b border-accent/20 bg-accent/10 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">
            Fungua Uhariri wa Mkataba
          </p>
          <p className="text-xs text-muted-foreground">Unlock Template Customization</p>
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {"Lipa mara moja "}
          <span className="font-bold text-foreground">TZS 10,000</span>
          {" ili kufungua uhariri kamili wa mkataba. Badilisha kifungu chochote, ongeza masharti mapya, na fanya mkataba uwe wako."}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Pay a one-time fee of TZS 10,000 to unlock full template editing for your account.
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            onClick={onPay}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <CreditCard className="h-4 w-4" />
            Lipa Sasa / Pay Now
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="gap-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Ghairi / Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Main Page                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export default function LeaseTemplatePage() {
  const [hasPaid, setHasPaid] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [template, setTemplate] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const currentTemplate = template || DEFAULT_TEMPLATE

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b-2 border-primary/15 bg-card shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Scale className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">
                LeaseForge
              </span>
              <p className="text-[10px] text-muted-foreground">Tanzania Contracts</p>
            </div>
          </div>
          {hasPaid ? (
            <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uhariri Umefunguliwa
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Mpango wa Bure / Free
            </Badge>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
                  Mkataba wa Kupangisha
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Lease Agreement Template
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-xs text-primary">
                <MapPin className="h-3 w-3" />
                Tanzania
              </Badge>
              <Badge variant="outline" className="gap-1.5 border-accent/30 bg-accent/5 text-xs text-accent">
                <Shield className="h-3 w-3" />
                Mpangishaji
              </Badge>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tumia mkataba huu wa bure, au lipa mara moja ili kubadilisha kila kifungu kulingana na mahitaji yako.
            Use the default template for free, or pay a one-time fee to fully customize every clause.
          </p>
        </header>

        {/* Content */}
        {isEditing ? (
          <EditorCard
            template={currentTemplate}
            hasPaid={hasPaid}
            onTemplateChange={(val: string) => setTemplate(val)}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
            onReset={() => {
              setTemplate(null)
              setIsEditing(false)
            }}
          />
        ) : (
          <>
            <PreviewCardComponent />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  if (hasPaid) {
                    setIsEditing(true)
                  } else {
                    setShowPayment(true)
                  }
                }}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {hasPaid ? (
                  <>
                    <Pencil className="h-4 w-4" />
                    Hariri Mkataba / Edit
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Badilisha (Lipa Kuhariri)
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-border text-foreground"
                onClick={async () => {
                  // Prompt for all required lease fields
                  const tenant_id = prompt("Enter Tenant ID to send lease to:");
                  if (!tenant_id) return;
                  const property_id = prompt("Enter Property ID:");
                  if (!property_id) return;
                  const landlord_id = prompt("Enter Landlord ID:");
                  if (!landlord_id) return;
                  const start_date = prompt("Enter Lease Start Date (YYYY-MM-DD):");
                  if (!start_date) return;
                  const end_date = prompt("Enter Lease End Date (YYYY-MM-DD):");
                  if (!end_date) return;
                  const monthly_rent = prompt("Enter Monthly Rent Amount:");
                  if (!monthly_rent) return;
                  // Render the full HTML of the contract preview
                  const container = document.createElement('div');
                  document.body.appendChild(container);
                  const { createRoot } = await import('react-dom/client');
                  const root = createRoot(container);
                  root.render(<PreviewCardComponent />);
                  setTimeout(async () => {
                    const html = container.innerHTML;
                    document.body.removeChild(container);
                    await fetch("/api/leases", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        property_id,
                        landlord_id,
                        tenant_id,
                        start_date,
                        end_date,
                        monthly_rent,
                        template: html
                      })
                    });
                    alert("Lease sent to tenant!");
                  }, 100);
                }}
              >
                <Send className="h-4 w-4" />
                Tuma kwa Mpangaji / Send
              </Button>
              <Button
                variant="secondary"
                className="gap-2 text-secondary-foreground"
              >
                <Download className="h-4 w-4" />
                Pakua PDF / Download
              </Button>
            </div>
          </>
        )}

        {showPayment && !hasPaid && (
          <PaymentCard
            onPay={() => {
              setHasPaid(true)
              setShowPayment(false)
              setIsEditing(true)
            }}
            onCancel={() => setShowPayment(false)}
          />
        )}

        {isEditing && !hasPaid && !showPayment && (
          <div className="mt-6">
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Lock className="h-4 w-4" />
              Lipa TZS 10,000 Kuhariri
            </Button>
          </div>
        )}

        <Separator className="mt-12 mb-6" />

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 pb-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Scale className="h-3.5 w-3.5 text-primary/50" />
            <p className="text-xs text-muted-foreground">
              LeaseForge — Mikataba ya Kitaalamu ya Tanzania
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Chini ya Sheria za Jamhuri ya Muungano wa Tanzania
          </p>
        </footer>
      </main>
    </div>
  )
}