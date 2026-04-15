"use client"

import React, { useRef, useState, useEffect, useMemo } from "react"
import { useLanguage } from "../../../contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Loader2,
  FileText,
  Image,
  File,
  X,
  Eye,
  Download,
  Upload,
  Lock,
  ShieldCheck,
  FolderOpen,
  RefreshCw,
  FileUp,
  TrendingUp,
  FileCheck2,
  FileClock,
  FileWarning,
  Search,
  ArrowRight,
} from "lucide-react"

/* ========================================== */
/* ─── Stub hooks (same pattern as all pages) */
/* ========================================== */
const useToast = () => ({
  toast: ({
    title,
    description,
    variant,
  }: {
    title: string
    description: string
    variant?: string
  }) => {
    console.log(`[Toast] ${title}: ${description}`)
  },
})

/* ========================================== */
/* ─── Sub-components (matching design lang) ─ */
/* ========================================== */

function StatCard({
  icon,
  value,
  label,
  trend,
  trendUp,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {trend && (
              <div
                className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? "text-primary" : "text-destructive"}`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${!trendUp ? "rotate-180" : ""}`}
                />
                {trend}
              </div>
            )}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    lease: {
      label: "Lease Agreement",
      className:
        "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
      icon: <FileText className="h-3 w-3" />,
    },
    id: {
      label: "Tenant ID",
      className:
        "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15",
      icon: <ShieldCheck className="h-3 w-3" />,
    },
    contract: {
      label: "Contract",
      className:
        "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/15",
      icon: <FileCheck2 className="h-3 w-3" />,
    },
    invoice: {
      label: "Invoice",
      className:
        "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15",
      icon: <FileClock className="h-3 w-3" />,
    },
    receipt: {
      label: "Receipt",
      className:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15",
      icon: <FileCheck2 className="h-3 w-3" />,
    },
    other: {
      label: "Other",
      className:
        "bg-muted text-muted-foreground border-muted-foreground/20 hover:bg-muted/80",
      icon: <File className="h-3 w-3" />,
    },
  }

  const c = config[type] || config.other

  return (
    <Badge
      className={`${c.className} gap-1 text-[10px] uppercase tracking-wider font-medium`}
    >
      {c.icon}
      {c.label}
    </Badge>
  )
}

function DocumentCard({
  doc,
  getFileIcon,
  formatFileSize,
  formatDate,
  t,
}: {
  doc: any
  getFileIcon: (type?: string | null) => React.ReactNode
  formatFileSize: (bytes: number) => string
  formatDate: (date: string) => string
  t: (key: string) => string
}) {
  const accentColors: Record<string, string> = {
    lease: "bg-primary",
    id: "bg-blue-500",
    contract: "bg-violet-500",
    invoice: "bg-amber-500",
    receipt: "bg-emerald-500",
    other: "bg-muted-foreground",
  }

  const accent = accentColors[doc.document_type] || accentColors.other

  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Top accent bar */}
      <div className={`h-1 ${accent}`} />

      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* File icon in rounded container */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60">
            {getFileIcon(doc.file_type)}
          </div>

          {/* File details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">
                  {doc.original_name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <TypeBadge type={doc.document_type} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  title="View"
                >
                  <Eye className="h-3.5 w-3.5" />
                </a>
                <a
                  href={doc.file_url}
                  download={doc.original_name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  title="Download"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5">
                <FileUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {formatFileSize(doc.file_size)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1.5">
                <FileClock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {formatDate(doc.uploaded_at)}
                </span>
              </div>
            </div>

            {doc.is_verified && (
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-primary">
                <ShieldCheck className="h-3 w-3" />
                {t("verified")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ t }: { t: (key: string) => string }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground text-lg mb-1">
          {t("vault_no_documents_title")}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {t("vault_no_documents_subtitle")}
        </p>
      </CardContent>
    </Card>
  )
}

/* ========================================== */
/* ─── Main Page Component ─────────────────── */
/* ========================================== */

export default function VaultPage() {
  // Language context
  const { language, setLanguage, t } = useLanguage()
  // Password gate state
  const [entered, setEntered] = useState(false)
  const [password, setPassword] = useState("")
  const [pwError, setPwError] = useState("")

  const [documents, setDocuments] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [documentType, setDocumentType] = useState("other")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [userId, setUserId] = useState("")

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("/api/session-user")
        const data = await res.json()
        if (data.userId) setUserId(data.userId)
      } catch {
        setUserId("")
      }
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    if (userId) fetchDocuments()
  }, [userId])

  const fetchDocuments = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const res = await fetch(`/api/documents`)
      const data = await res.json()
      if (data.success) {
        const mappedDocs = data.documents.map((doc: any) => ({
          id: doc.id,
          document_type: doc.document_type,
          original_name: doc.file_name,
          file_url: doc.file_url,
          file_size: doc.file_size,
          file_type: doc.mime_type,
          is_verified: doc.is_verified,
          expires_at: doc.expires_at,
          uploaded_at: doc.created_at,
        }))
        setDocuments(mappedDocs)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load documents",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Connection Error",
        description: "Could not connect to server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      })
      return
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, JPG, PNG, or DOC files only",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await fetch(`/api/upload?document_type=${documentType}`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        })

        setSelectedFile(null)
        setDocumentType("other")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        fetchDocuments()
      } else {
        toast({
          title: "Upload Failed",
          description: data.message || "Failed to upload document",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (fileType?: string | null) => {
    if (!fileType)
      return <File className="h-5 w-5 text-muted-foreground" />
    if (fileType.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-500" />
    if (fileType.includes("image"))
      return <Image className="h-5 w-5 text-blue-500" />
    if (fileType.includes("word"))
      return <File className="h-5 w-5 text-blue-600" />
    return <File className="h-5 w-5 text-muted-foreground" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Derived stats
  const totalDocs = documents.length
  const verifiedDocs = documents.filter((d) => d.is_verified).length
  const leaseCount = documents.filter(
    (d) => d.document_type === "lease"
  ).length
  const recentCount = documents.filter((d) => {
    const uploaded = new Date(d.uploaded_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return uploaded >= thirtyDaysAgo
  }).length

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      doc.original_name?.toLowerCase().includes(q) ||
      doc.document_type?.toLowerCase().includes(q)
    )
  })

  // Password gate handler
  const handleEnter = async () => {
    if (password.trim() === "") {
      setPwError("Password required")
      return
    }
    try {
      const res = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.success) {
        setEntered(true)
        setPwError("")
      } else {
        setPwError("Incorrect password")
      }
    } catch {
      setPwError("Error verifying password")
    }
  }

  /* ─── Password Gate Screen ─── */
  if (!entered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md overflow-hidden border-border/60 shadow-lg">
          {/* Accent bar */}
          <div className="h-1.5 bg-primary" />
          <CardContent className="p-8">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6">
              <Lock className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {/* Vault Access Title Label */}
              {t("vault_access_title")}
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              {/* Vault Access Subtitle Label */}
              {t("vault_access_subtitle")}
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="vault-password"
                  className="text-sm font-medium text-foreground"
                >
                  {/* Vault Password Placeholder Label */}
                  {t("vault_password_placeholder")}
                </Label>
                <Input
                  id="vault-password"
                  type="password"
                  placeholder={t("vault_password_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEnter()
                  }}
                  className="h-11"
                />
              </div>

              {pwError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                  <FileWarning className="h-4 w-4 text-destructive shrink-0" />
                  <span className="text-destructive text-xs font-medium">
                    {pwError}
                  </span>
                </div>
              )}

              <Button className="w-full h-11 gap-2" onClick={handleEnter}>
                <ShieldCheck className="h-4 w-4" />
                {/* Vault Enter Button Label */}
                {t("vault_enter_button")}
              </Button>
            </div>
            {/* Language Switcher */}
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                className="gap-2"
              >
                {language === "en" ? "Swahili" : "English"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Vault Page
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {t("vault_documents_title")}
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-1 ml-[52px]">
            {t("vault_documents_subtitle")}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FolderOpen className="h-5 w-5" />}
            value={totalDocs}
            label={t("vault_documents_list_title")}
          />
          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            value={verifiedDocs}
            label={t("verified")}
            trend={
              totalDocs > 0
                ? `${Math.round((verifiedDocs / totalDocs) * 100)}%`
                : undefined
            }
            trendUp={true}
          />
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            value={leaseCount}
            label={t("vault_document_type_lease")}
          />
          <StatCard
            icon={<FileUp className="h-5 w-5" />}
            value={recentCount}
            label={t("last_30_days")}
          />
        </div>

        {/* Upload Section */}
        <Card className="mb-8 overflow-hidden border-border/60 shadow-sm">
          <div className="h-1 bg-primary" />
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {t("vault_upload_title")}
              </h2>
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <FileUp className="h-7 w-7" />
              </div>

              <p className="text-sm font-medium text-foreground mb-1">
                {t("vault_upload_dragdrop")}
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                {t("vault_upload_fileinfo")}
              </p>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4" />
                {t("vault_select_file_button")}
              </Button>

              {selectedFile && (
                <div className="w-full max-w-md mt-6">
                  {/* Selected file preview */}
                  <div className="flex items-center justify-between bg-card border border-border/60 rounded-xl p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                        {getFileIcon(selectedFile.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeSelectedFile}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="document-type"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("vault_document_type_label")}
                      </Label>
                      <Select
                        value={documentType}
                        onValueChange={setDocumentType}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={t("vault_document_type_placeholder")}/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lease">
                            {t("vault_document_type_lease")}
                          </SelectItem>
                          <SelectItem value="id">{t("vault_document_type_id")}</SelectItem>
                          <SelectItem value="contract">{t("vault_document_type_contract")}</SelectItem>
                          <SelectItem value="invoice">{t("vault_document_type_invoice")}</SelectItem>
                          <SelectItem value="receipt">{t("vault_document_type_receipt")}</SelectItem>
                          <SelectItem value="other">{t("vault_document_type_other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full h-10 gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t("vault_uploading")}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          {t("vault_upload_button")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <div className="h-1 bg-primary/60" />
          <CardContent className="p-6">
            {/* List header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {t("vault_documents_list_title")}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 ml-1"
                >
                  {filteredDocs.length}
                </Badge>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("vault_documents_search_placeholder") || "Search documents..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDocuments}
                  disabled={loading}
                  className="gap-1.5 shrink-0"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {t("vault_refresh_button")}
                </Button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("loading")}
                </p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <EmptyState t={t} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    getFileIcon={getFileIcon}
                    formatFileSize={formatFileSize}
                    formatDate={formatDate}
                    t={t}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}