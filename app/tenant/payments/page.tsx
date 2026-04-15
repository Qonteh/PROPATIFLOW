import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function TenantPaymentsPage() {
  const payments = [
    {
      id: "1",
      description: "January Rent",
      property: "Sunset Apartments - Unit 204",
      amount: 450000,
      dueDate: "Jan 1, 2025",
      status: "due_soon",
    },
    {
      id: "2",
      description: "December Rent",
      property: "Sunset Apartments - Unit 204",
      amount: 450000,
      dueDate: "Dec 1, 2024",
      paidDate: "Nov 28, 2024",
      status: "paid",
    },
    {
      id: "3",
      description: "Security Deposit",
      property: "Sunset Apartments - Unit 204",
      amount: 450000,
      dueDate: "Nov 1, 2024",
      paidDate: "Oct 28, 2024",
      status: "paid",
    },
  ]

  const upcomingTotal = payments
    .filter((p) => p.status === "due_soon" || p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">Manage your rent and other payments</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {upcomingTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh 450,000</div>
            <p className="text-xs text-muted-foreground">1 payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">On Time</div>
            <p className="text-xs text-accent">100% payment history</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All your rent and payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border ${
                  payment.status === "due_soon" ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      payment.status === "paid"
                        ? "bg-accent/10"
                        : payment.status === "due_soon"
                          ? "bg-accent/20"
                          : "bg-muted"
                    }`}
                  >
                    {payment.status === "paid" ? (
                      <CheckCircle className="h-6 w-6 text-accent" />
                    ) : payment.status === "due_soon" ? (
                      <Clock className="h-6 w-6 text-accent" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{payment.description}</p>
                      <Badge
                        variant={
                          payment.status === "paid"
                            ? "default"
                            : payment.status === "due_soon"
                              ? "secondary"
                              : "destructive"
                        }
                        className={payment.status === "paid" ? "bg-accent/10 text-accent" : ""}
                      >
                        {payment.status === "paid" ? "Paid" : payment.status === "due_soon" ? "Due Soon" : "Overdue"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{payment.property}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {payment.dueDate}
                      {payment.paidDate && ` • Paid: ${payment.paidDate}`}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold">Tsh {payment.amount.toLocaleString()}</p>
                  </div>
                  {payment.status !== "paid" && (
                    <Button size="sm" className="whitespace-nowrap">
                      Pay Now
                    </Button>
                  )}
                  {payment.status === "paid" && (
                    <Button size="sm" variant="outline" className="bg-transparent whitespace-nowrap">
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-muted-foreground">CRDB Bank •••• 1234</p>
                </div>
              </div>
              <Badge variant="default">Primary</Badge>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Mobile Money</p>
                  <p className="text-sm text-muted-foreground">M-Pesa •••• 6789</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
