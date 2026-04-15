
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Plus, Mail, Phone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ClientsPage() {
  const { t } = useLanguage();
  const clients = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 123-4567",
      type: "Tenant",
      status: "Active",
      activeDeals: 1,
      creditScore: 720,
      budget: "Tsh 375,000 - 500,000",
      since: "Dec 2024",
    },
    {
      id: "2",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 234-5678",
      type: "Landlord",
      status: "Active",
      properties: 5,
      activeDeals: 2,
      since: "Nov 2024",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 345-6789",
      type: "Tenant",
      status: "Active",
      activeDeals: 1,
      creditScore: 680,
      budget: "Tsh 500,000 - 625,000",
      since: "Dec 2024",
    },
    {
      id: "4",
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      phone: "+1 (555) 456-7890",
      type: "Landlord",
      status: "Active",
      properties: 3,
      activeDeals: 1,
      since: "Oct 2024",
    },
    {
      id: "5",
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "+1 (555) 567-8901",
      type: "Tenant",
      status: "Inactive",
      activeDeals: 0,
      creditScore: 750,
      budget: "Tsh 500,000 - 625,000",
      since: "Sep 2024",
    },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("clients")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("manage_landlord_tenant_relationships")}</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            {t("add_client")}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("search_clients_placeholder")} className="pl-10 text-sm md:text-base" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            {t("filters")}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">{t("total_clients")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.filter((c) => c.type === "Tenant").length}</div>
            <p className="text-sm text-muted-foreground">{t("tenants")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.filter((c) => c.type === "Landlord").length}</div>
            <p className="text-sm text-muted-foreground">{t("landlords")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.filter((c) => c.status === "Active").length}</div>
            <p className="text-sm text-muted-foreground">{t("active")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="space-y-3 md:space-y-4">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Avatar className="h-12 w-12 self-start">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base md:text-lg font-bold">{client.name}</h3>
                        <Badge variant={client.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {client.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {client.type}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          {client.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                    {client.type === "Tenant" ? (
                      <>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground">{t("credit_score")}</p>
                          <p className="font-medium text-sm md:text-base">{client.creditScore}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground">{t("budget_range")}</p>
                          <p className="font-medium text-sm md:text-base">{client.budget}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">{t("properties")}</p>
                        <p className="font-medium text-sm md:text-base">{client.properties} {t("properties")}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{t("active_deals")}</p>
                      <p className="font-medium text-sm md:text-base">{client.activeDeals} {t("deals")}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">{t("client_since")}</p>
                      <p className="font-medium text-sm md:text-base">{client.since}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm">
                      <Mail className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                      <span className="hidden md:inline">{t("email")}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm">
                      <Phone className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                      <span className="hidden md:inline">{t("call")}</span>
                    </Button>
                    <Button size="sm" className="text-xs md:text-sm">
                      {t("view_profile")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
