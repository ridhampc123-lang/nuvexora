"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminPaymentsQuery, useCreateAdminPaymentMutation, useUpdateAdminPaymentMutation, useDeleteAdminPaymentMutation, useAdminInvoicesQuery, useAdminClientsQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, CreditCard, Banknote, Clock, Receipt } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments = [], isLoading } = useAdminPaymentsQuery();
  const { data: invoices = [] } = useAdminInvoicesQuery();
  const { data: clients = [] } = useAdminClientsQuery();

  const createPayment = useCreateAdminPaymentMutation();
  const updatePayment = useUpdateAdminPaymentMutation();
  const deletePayment = useDeleteAdminPaymentMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);

  const [formData, setFormData] = useState({
    invoiceId: "",
    clientId: "",
    amount: 0,
    paymentMethod: "card",
    transactionId: "",
    status: "completed"
  });

  const openDrawer = (payment?: any) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        invoiceId: payment.invoiceId?._id || "",
        clientId: payment.clientId?._id || "",
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        status: payment.status
      });
    } else {
      setEditingPayment(null);
      setFormData({
        invoiceId: "",
        clientId: "",
        amount: 0,
        paymentMethod: "card",
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "completed"
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayment) {
      updatePayment.mutate(
        { id: editingPayment._id, ...formData },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createPayment.mutate(formData, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Transaction ID",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white font-mono">{row.transactionId}</div>
            <div className="text-[10px] text-slate-500">Invoice: {row.invoiceId?.invoiceNumber || 'Unknown'}</div>
          </div>
        </div>
      )
    },
    {
      header: "Client",
      cell: (row) => (
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.clientId?.name || 'Unknown Client'}
        </div>
      )
    },
    {
      header: "Amount",
      cell: (row) => (
        <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
          ₹{row.amount.toLocaleString("en-IN")}
        </div>
      )
    },
    {
      header: "Method",
      cell: (row) => (
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
          {row.paymentMethod.replace("_", " ")}
        </span>
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "failed" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" :
          "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDrawer(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => deletePayment.mutate(row._id)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Payment Transactions"
        description="Audit received client payments, transaction hashes, and revenue breakdown."
        columns={columns}
        data={isLoading ? [] : payments}
        searchPlaceholder="Search payments..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        }
      />

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingPayment ? "Edit Payment" : "Record Payment"}
                    </h2>
                    <p className="text-xs text-slate-500">Log incoming client transaction</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice</label>
                    <select required value={formData.invoiceId} onChange={e => setFormData({...formData, invoiceId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <option value="">-- Select Invoice --</option>
                      {invoices.map((inv: any) => (
                        <option key={inv._id} value={inv._id}>{inv.invoiceNumber} (₹{inv.totalAmount?.toLocaleString("en-IN")})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Transaction ID</label>
                    <input required type="text" value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Client</label>
                    <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <option value="">-- Select Client --</option>
                      {clients.map((c: any) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Invoice</label>
                    <select required value={formData.invoiceId} onChange={e => setFormData({...formData, invoiceId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <option value="">-- Select Invoice --</option>
                      {invoices.map((inv: any) => (
                        <option key={inv._id} value={inv._id}>{inv.invoiceNumber} (${inv.totalAmount})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Amount</label>
                      <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Method</label>
                      <select required value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
                        <option value="card">Card</option>
                        <option value="stripe">Stripe</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="crypto">Crypto</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50">
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createPayment.isPending || updatePayment.isPending} className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50">
                    {createPayment.isPending || updatePayment.isPending ? "Saving..." : editingPayment ? "Save Changes" : "Record Payment"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
