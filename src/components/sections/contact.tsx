"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/common/section-title";
import { submitLeadInquiry } from "@/lib/api/public-api";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Building2, Mail, User, Phone, IndianRupee, Calendar, Tag } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceCategory: "AI Systems & Machine Learning",
    budgetRange: "₹25,000 - ₹50,000",
    timeline: "1 - 3 Months",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      await submitLeadInquiry(formData);
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        serviceCategory: "AI Systems & Machine Learning",
        budgetRange: "₹25,000 - ₹50,000",
        timeline: "1 - 3 Months",
        message: "",
      });
    } catch (err: any) {
      console.error("Failed to submit inquiry", err);
      setErrorMsg(err.response?.data?.message || "Failed to submit project inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-950 relative overflow-hidden">
      {/* Dynamic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Container size="2xl" className="relative z-10">
        <SectionTitle
          eyebrow="Contact & Project Inquiry"
          title="Let’s map the right engagement."
          description="Share your product goals and we’ll shape the delivery model around scope, team size, and timeline."
        />

        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          {success && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-start gap-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Inquiry Received Successfully!</h4>
                <p className="text-sm text-emerald-300/90 leading-relaxed">
                  Thank you for sharing your scope. Our solution architect will analyze your requirements and get in touch with a customized delivery roadmap within 24 hours.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 flex items-center gap-3 shadow-md">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-xs font-semibold">{errorMsg}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-slate-900/70 dark:bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6"
          >
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Business Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="alexander@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Row 2: Phone & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone Number <span className="text-slate-500 text-[10px] lowercase font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" /> Company / Organization <span className="text-slate-500 text-[10px] lowercase font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Apex Technologies Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Row 3: Service Category, Budget, Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-400" /> Service Category
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white focus:border-blue-500 outline-none text-sm transition-all cursor-pointer"
                >
                  <option value="AI Systems & Machine Learning">AI Systems & ML Pipelines</option>
                  <option value="Web & Mobile Engineering">Web & Mobile Engineering</option>
                  <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                  <option value="Cybersecurity & Compliance">Cybersecurity & Zero-Trust</option>
                  <option value="Enterprise Software Architecture">Enterprise SaaS Architecture</option>
                  <option value="Technical Advisory & Audit">Technical Consulting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-blue-400" /> Budget Range
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white focus:border-blue-500 outline-none text-sm transition-all cursor-pointer"
                >
                  <option value="Under ₹10,000">&lt; ₹10,000</option>
                  <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹100,000">₹50,000 - ₹100,000</option>
                  <option value="₹100,000+">₹100,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Target Launch Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white focus:border-blue-500 outline-none text-sm transition-all cursor-pointer"
                >
                  <option value="Immediate (1-2 weeks)">Immediate (1-2 weeks)</option>
                  <option value="1 - 3 Months">1 - 3 Months</option>
                  <option value="3 - 6 Months">3 - 6 Months</option>
                  <option value="Flexible / Discovery">Flexible / Discovery Phase</option>
                </select>
              </div>
            </div>

            {/* Row 4: Message Overview */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Project Details & Goals <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe your project goals, technical requirements, existing tech stack, and key metrics for success..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 group shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Send Project Inquiry</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}