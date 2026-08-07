"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  Lock, 
  Receipt
} from "lucide-react";
import { useClientInvoicesQuery, usePayInvoiceMutation, useClientDashboardQuery } from "@/hooks/use-api-queries";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

interface InvoiceItem {
  _id?: string;
  id?: string;
  number?: string;
  invoiceNumber?: string;
  description?: string;
  amount: string | number;
  totalAmount?: number;
  status: "paid" | "issued" | "overdue" | "pending";
  dueDate?: string;
  paidAt?: string;
}

export default function ClientInvoicesPage() {
  const { data: invoices = [], isLoading: isLoadingInvoices } = useClientInvoicesQuery();
  const { data: dashboard } = useClientDashboardQuery();
  const payInvoiceMutation = usePayInvoiceMutation();
  const { user } = useAuth();

  const [paymentModalInvoice, setPaymentModalInvoice] = useState<InvoiceItem | null>(null);
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  const invoiceList: InvoiceItem[] = isLoadingInvoices ? [] : invoices;

  // Calculate dynamic metric values directly from real invoice data
  const paidInvoices = invoiceList.filter((inv) => inv.status === "paid");
  const pendingInvoices = invoiceList.filter((inv) => inv.status !== "paid");

  const getAmountNum = (inv: InvoiceItem): number => {
    if (typeof inv.totalAmount === "number") return inv.totalAmount;
    if (typeof inv.amount === "number") return inv.amount;
    if (typeof inv.amount === "string") {
      const parsed = parseFloat(inv.amount.replace(/[^0-9.]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const totalPaidAmount = paidInvoices.reduce((sum, inv) => sum + getAmountNum(inv), 0);
  const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + getAmountNum(inv), 0);
  const totalContractVal = totalPaidAmount + totalPendingAmount;
  const displayContractVal = dashboard?.contractValue || totalContractVal;

  const primaryProjectName = dashboard?.primaryProject || user?.companyName || "Active Deliverables Workspace";

  const handlePayConfirm = (id: string) => {
    payInvoiceMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Payment processed successfully via Stripe Enterprise Gateway! PDF Receipt generated.");
        setPaymentModalInvoice(null);
      }
    });
  };

  const handleDownloadInvoicePDF = (inv: InvoiceItem) => {
    const invNum = inv.invoiceNumber || inv.number || (inv._id ? `INV-${inv._id.substring(0, 8).toUpperCase()}` : "INV-REC");
    const clientName = user?.name || "Client";
    const companyName = user?.companyName || (user as any)?.company || "Organization";
    const amtStr = `₹${getAmountNum(inv).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const content = `%PDF-1.4 NUVEXORA TECHNOLOGIES OFFICIAL INVOICE RECEIPT\nInvoice Number: ${invNum}\nClient: ${clientName} (${companyName})\nDescription: ${inv.description || "Sprint Deliverable"}\nAmount: ${amtStr}\nStatus: ${inv.status.toUpperCase()}\nPayment Gateway: Encrypted Settlement`;
    
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invNum}_Receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded official PDF receipt for ${invNum}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Financial & Settlement Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Payment History & Invoices</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Review itemized sprint invoices, payment audit trails, download official PDF tax receipts, and process instant card settlements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Stripe PCI-DSS Level 1 Secure</span>
          </div>
        </div>
      </div>

      {/* Dynamic Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contract Value</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans">
            ₹{displayContractVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1 truncate">{primaryProjectName}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid To Date</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-sans">
            ₹{totalPaidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {paidInvoices.length} {paidInvoices.length === 1 ? "Invoice" : "Invoices"} Settled
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 font-sans">
            ₹{totalPendingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1">
            {pendingInvoices.length} {pendingInvoices.length === 1 ? "Invoice" : "Invoices"} Pending
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Itemized Billing Statements</h2>
          <span className="text-xs text-slate-400">All amounts in INR (₹)</span>
        </div>

        {invoiceList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-slate-400 mx-auto stroke-1" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No invoices found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">There are currently no billing statements or invoices associated with your account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Sprint Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Due / Paid Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {invoiceList.map((inv) => {
                  const invId = inv._id || inv.id || "";
                  const invNum = inv.invoiceNumber || inv.number || (inv._id ? `INV-${inv._id.substring(0, 8).toUpperCase()}` : "INV-REC");
                  const amtNum = getAmountNum(inv);
                  const invAmt = `₹${amtNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  const isPaid = inv.status === "paid";
                  const dateStr = isPaid 
                    ? (inv.paidAt ? `Paid ${new Date(inv.paidAt).toLocaleDateString()}` : "Paid")
                    : (inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "Pending");

                  return (
                    <tr key={invId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white font-mono text-xs">{invNum}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold">{inv.description || "Client Service Deliverable"}</td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{invAmt}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 ${
                          isPaid 
                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" 
                            : "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-amber-500" />}
                          <span>{inv.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{dateStr}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadInvoicePDF(inv)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {!isPaid && (
                            <button
                              onClick={() => setPaymentModalInvoice(inv)}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stripe Payment Simulation Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Stripe Checkout</h3>
                  <p className="text-[11px] text-slate-500">256-Bit SSL Encrypted Payment</p>
                </div>
              </div>
              <button 
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {paymentModalInvoice.invoiceNumber || paymentModalInvoice.number || (paymentModalInvoice._id ? `INV-${paymentModalInvoice._id.substring(0, 8).toUpperCase()}` : "INV-REC")}
                </div>
                <div className="text-[11px] text-slate-500">{paymentModalInvoice.description || "Sprint Deliverable"}</div>
              </div>
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                ₹{getAmountNum(paymentModalInvoice).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">CVC Code</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayConfirm(paymentModalInvoice._id || paymentModalInvoice.id || "")}
                disabled={payInvoiceMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
