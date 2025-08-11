"use client"

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription Plan</CardTitle>
          <CardDescription>Manage your organization&apos;s subscription plan.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Pro Plan</p>
            <p className="text-sm text-muted-foreground">Billed monthly at $100</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Change Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Subscription Plan</DialogTitle>
                <DialogDescription>Select a new plan for your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">This is a placeholder for plan selection.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Update Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            You can pay annually if you upgrade to an Enterprise plan. The Enterprise plan offers increased performance,
            collaboration, and security needs. [^3]
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Invoices</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label={`Download invoice ${invoice.id}`}>
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
          <CardTitle>Invoice Email Recipient</CardTitle>
          <CardDescription>The email address that will receive your organization&apos;s invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="invoice-email">Email Address</Label>
            <Input id="invoice-email" type="email" defaultValue="billing@acmeinc.com" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
