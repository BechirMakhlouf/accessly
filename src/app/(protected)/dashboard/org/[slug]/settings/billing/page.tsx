"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DownloadIcon } from "lucide-react"
import { useActiveOrganization } from "@/modules/organizations"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"

const invoices = [
  {
    id: "INV001",
    amount: "$100.00",
    status: "Paid",
    date: "2024-07-01",
  },
  {
    id: "INV002",
    amount: "$100.00",
    status: "Paid",
    date: "2024-08-01",
  },
  {
    id: "INV003",
    amount: "$100.00",
    status: "Pending",
    date: "2024-09-01",
  },
  {
    id: "INV004",
    amount: "$100.00",
    status: "Paid",
    date: "2024-10-01",
  },
]

export default function BillingSettingsPage() {
  const { activeOrganization: org } = useActiveOrganization();
  const t = useTranslations("org.settings.billing");
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  const handleChangePlan = () => {
    // Here you would typically handle plan changes
    console.log("Changing plan for organization:", org.id);
    setIsChangePlanDialogOpen(false);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("currentPlan.title")}</CardTitle>
          <CardDescription>{t("currentPlan.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{t("currentPlan.planName")}</p>
            <p className="text-sm text-muted-foreground">{t("currentPlan.planDescription")}</p>
          </div>
          <Dialog open={isChangePlanDialogOpen} onOpenChange={setIsChangePlanDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">{t("currentPlan.changePlan")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("currentPlan.modalTitle")}</DialogTitle>
                <DialogDescription>{t("currentPlan.modalDescription")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">{t("currentPlan.placeholder")}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChangePlanDialogOpen(false)}>
                  {t("currentPlan.cancel")}
                </Button>
                <Button onClick={handleChangePlan}>
                  {t("currentPlan.updatePlan")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            {t("currentPlan.enterpriseDescription")}
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("pastInvoices.title")}</CardTitle>
          <CardDescription>{t("pastInvoices.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pastInvoices.invoiceNumber")}</TableHead>
                <TableHead>{t("pastInvoices.amount")}</TableHead>
                <TableHead>{t("pastInvoices.status")}</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" aria-label={t("pastInvoices.download")}>
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("invoiceEmailRecipient.title")}</CardTitle>
          <CardDescription>{t("invoiceEmailRecipient.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="invoice-email">{t("invoiceEmailRecipient.emailAddress")}</Label>
            <Input id="invoice-email" type="email" defaultValue={t("invoiceEmailRecipient.defaultEmail")} />
          </div>
        </CardContent>
                  <CardFooter className="border-t px-6 py-4">
            <Button>{t("saveChanges")}</Button>
          </CardFooter>
      </Card>
    </div>
  )
}
