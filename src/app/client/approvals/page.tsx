"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  FileText, 
  AlertCircle, 
  Send, 
  ShieldCheck, 
  Check, 
  X, 
  CornerDownRight, 
  Eye, 
  ExternalLink
} from "lucide-react";
import { 
  useClientApprovalsQuery, 
  useApproveDeliverableMutation, 
  useRequestChangesMutation 
} from "@/hooks/use-api-queries";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export default function DeliverableApprovalsPage() {
  const { data: approvals = [], isLoading } = useClientApprovalsQuery();
  const { user } = useAuth();
  const approveMutation = useApproveDeliverableMutation();
  const requestChangesMutation = useRequestChangesMutation();

  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentSeverity, setCommentSeverity] = useState<"minor" | "major">("minor");
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState("");

  const activeApproval = approvals.find((a: any) => a.id === (selectedApprovalId || approvals[0]?.id));

  const handleApproveConfirm = (id: string) => {
    if (!digitalSignature.trim()) {
      toast.error("Please enter your full name as digital signature to sign off.");
      return;
    }

    approveMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Deliverable & Stage Gate successfully approved!");
        setShowApprovalModal(null);
        setDigitalSignature("");
      }
    });
  };

  const handleRequestChanges = (id: string) => {
    if (!commentText.trim()) {
      toast.error("Please provide comments describing the requested changes.");
      return;
    }

    requestChangesMutation.mutate(
      { id, comment: commentText, severity: commentSeverity },
      {
        onSuccess: () => {
          toast.info("Change request submitted with comments to lead engineers.");
          setCommentText("");
        }
      }
    );
  };
  if (approvals.length === 0 && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Deliverables & Stage Gates</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Design & Stage Approvals</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Review architectural specifications, design prototypes, and engineering milestone deliverables.
            </p>
          </div>
        </div>

        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto">
          <CheckCircle2 className="w-12 h-12 text-slate-450 mx-auto opacity-55" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Approvals</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            There are no deliverables or milestones awaiting your sign-off at this stage. You will be notified as soon as engineers submit items for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deliverables & Stage Gates</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Design & Stage Approvals</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Review architectural specifications, design prototypes, and engineering milestone deliverables. Provide formal stage sign-off or submit detailed change requests.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>1 Pending Client Signoff</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Approvals List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Review Submissions ({approvals.length})
          </h2>

          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading deliverables...</div>
          ) : (
            approvals.map((item: any) => {
              const isSelected = item.id === (activeApproval?.id);
              const isApproved = item.status === "approved";
              const isChangesRequested = item.status === "changes_requested";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedApprovalId(item.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-md"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {item.category}
                    </span>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isApproved
                        ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : isChangesRequested
                        ? "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        : "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    }`}>
                      {isApproved ? <Check className="w-3 h-3" /> : isChangesRequested ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isApproved ? "Approved" : isChangesRequested ? "Changes Requested" : "Awaiting Signoff"}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {item.stageName} • Version {item.version}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>By {item.submittedBy.split(" ")[0]}</span>
                    <span>{item.submittedAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Deliverable & Commenting Panel */}
        <div className="lg:col-span-7">
          {activeApproval ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {activeApproval.stageName}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {activeApproval.title}
                  </h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Submitted on {activeApproval.submittedAt} by <span className="font-semibold text-slate-800 dark:text-slate-200">{activeApproval.submittedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-slate-700 dark:text-slate-300">
                    {activeApproval.version}
                  </span>
                </div>
              </div>

              {/* Description & Technical Context */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Deliverable Overview & Specifications</h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  {activeApproval.description}
                </p>
              </div>

              {/* Deliverable Embed / Preview Placeholder Box */}
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Interactive Stage Artifact & Specs</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Click to inspect technical blueprint or design export file</div>
                </div>
                <button 
                  onClick={() => toast.info("Opening high-resolution deliverable preview window...")}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect High-Res Deliverable</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Actions & Digital Sign-off Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Formal Deliverable Sign-off</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Approving locks this milestone stage and advances sprint workflow.</div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {activeApproval.status === "approved" ? (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Approved on {activeApproval.approvedAt || "Jul 22"}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApprovalModal(activeApproval.id)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Sign Off Stage</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Request Changes & Contextual Comment Threads */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>Request Changes & Comments</span>
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">2 Thread Messages</span>
                </div>

                {/* Comment Threads */}
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{user?.name || "Client"} (Client Lead)</span>
                      <span className="text-[10px] text-slate-400">Jul 23, 2:14 PM</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Can we verify that the OAuth token refresh endpoint enforces strict rate limits under 100 req/sec?
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 ml-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-blue-500" />
                        Alexander Vance (Lead Systems Architect)
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">Nuvexora Team</span>
                    </div>
                    <p className="text-blue-900 dark:text-blue-200">
                      Confirmed Marcus! Token refresh endpoints are rate-limited via Redis sliding-window counter capped at 60 req/min per client ID.
                    </p>
                  </div>
                </div>

                {/* New Comment Input Box */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Comment Severity:</span>
                    <button
                      type="button"
                      onClick={() => setCommentSeverity("minor")}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        commentSeverity === "minor"
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent"
                      }`}
                    >
                      Minor Feedback (Non-blocking)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentSeverity("major")}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                        commentSeverity === "major"
                          ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent"
                      }`}
                    >
                      Major Revision Request (Requires Re-submission)
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add change request note or technical question for Nuvexora engineers..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRequestChanges(activeApproval.id);
                      }}
                    />
                    <button
                      onClick={() => handleRequestChanges(activeApproval.id)}
                      disabled={requestChangesMutation.isPending}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-2 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              Select a deliverable from the list to review specifications and provide sign-off.
            </div>
          )}
        </div>
      </div>

      {/* Digital Approval Sign-off Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Digital Sign-off</h3>
                  <p className="text-[11px] text-slate-500">Formal stage gate approval confirmation</p>
                </div>
              </div>
              <button 
                onClick={() => setShowApprovalModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              By signing below, you certify that <span className="font-bold text-slate-900 dark:text-white">{activeApproval?.title}</span> meets client specifications and is formally approved for deployment.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Type Full Legal Name (Digital Signature):
              </label>
              <input
                type="text"
                value={digitalSignature}
                onChange={(e) => setDigitalSignature(e.target.value)}
                placeholder={`e.g. ${user?.name || "Marcus Vance"}`}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowApprovalModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveConfirm(showApprovalModal)}
                disabled={approveMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Sign-off</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
