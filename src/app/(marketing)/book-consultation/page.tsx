"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FAQSection } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { submitLeadInquiry } from "@/lib/api/public-api";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  Building2,
  Send,
  Loader2,
  ShieldCheck,
  Award,
  ArrowRight,
  HelpCircle,
  ChevronDown
} from "lucide-react";

export default function BookConsultationPage() {
  const [selectedTopic, setSelectedTopic] = useState("AI Architecture & Machine Learning");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00 AM EST");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const topics = [
    { id: "ai", title: "AI Architecture & Machine Learning", desc: "Private LLM deployment, RAG vector DBs, autonomous AI agents" },
    { id: "web", title: "Web & Mobile App Engineering", desc: "Next.js 15, React Native, high-scale performance & microservices" },
    { id: "cloud", title: "Cloud DevOps & Migration", desc: "AWS/GCP Kubernetes, Terraform IaC, FinOps cost reduction" },
    { id: "audit", title: "Legacy Codebase Audit & Security", desc: "SOC2 compliance, vulnerability scan, refactoring strategy" },
  ];

  const timeSlots = ["09:00 AM EST", "10:30 AM EST", "01:00 PM EST", "03:30 PM EST", "05:00 PM EST"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitLeadInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceCategory: selectedTopic,
        budgetRange: "Consultation Request",
        timeline: selectedDate ? `${selectedDate} at ${selectedTime}` : "Immediate Strategy Call",
        message: `[BOOK CONSULTATION CALL]\nTopic: ${selectedTopic}\nPreferred Time: ${selectedDate || "Next Available Slot"} at ${selectedTime}\nNotes: ${formData.notes}`,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to schedule consultation", err);
      setError(err.response?.data?.message || "Failed to schedule strategy call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Ambient Radial Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* 1. Hero Header */}
      <section className="pt-16 sm:pt-20 pb-12 relative z-10 border-b border-slate-800/80">
        <Container size="2xl" className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>100% Free Strategy Session</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Book Your Free 45-Minute{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Technical Strategy Call
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Speak 1-on-1 with a Senior Technical Architect. We will analyze your product requirements, evaluate tech feasibility, and deliver a custom delivery roadmap—no sales pitches or obligation.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Direct with Lead Architect</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Strict NDA Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Free Architecture Report</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Interactive Booking Form & Meeting Details */}
      <section className="py-12 sm:py-16 relative z-10">
        <Container size="2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
            {/* Left: What to Expect Box */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">45-Min Google Meet Call</h3>
                    <p className="text-xs text-slate-400">Interactive Technical Workshop</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Agenda & Takeaways</h4>
                  
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span><strong>Technical Audit:</strong> Analysis of your current stack, bottlenecks, and security posture.</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span><strong>Architecture Blueprint:</strong> Recommended tech stack (Next.js, Python, Vector DBs, Cloud).</span>
                  </div>

                  <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span><strong>Timeline & Budget:</strong> Transparent milestone estimate with fixed scope options.</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <span className="font-bold text-blue-400">🔒 Confidentiality Guaranteed:</span>
                  <p>All information shared during this call is protected under a strict mutual NDA framework.</p>
                </div>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-8">
                {submitted ? (
                  <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Strategy Call Requested!</h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                      We have received your consultation details. Our Lead Architect will review your topic ({selectedTopic}) and send a calendar invitation with a Google Meet link within 4 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                    >
                      Book Another Session
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Select Topic */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        1. Select Consultation Topic
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topics.map((t) => (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => setSelectedTopic(t.title)}
                            className={`p-3.5 rounded-2xl text-left border transition-all ${
                              selectedTopic === t.title
                                ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-600/20"
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <div className="font-bold text-xs text-white mb-1">{t.title}</div>
                            <div className="text-[11px] text-slate-400 leading-snug">{t.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Preferred Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" /> Preferred Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-400" /> Preferred Time Slot
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Step 3: Contact Info */}
                    <div className="space-y-4 pt-2 border-t border-slate-800/80">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        2. Your Contact Information
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Full Name *"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            required
                            placeholder="Work Email *"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Phone Number (Optional)"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <textarea
                          rows={3}
                          placeholder="Briefly describe your project goals or specific questions for the architect..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500 leading-relaxed"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Scheduling Strategy Call...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm & Book Free Call</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Consultation FAQs */}
      <FAQSection />

      {/* 4. CTA */}
      <CTA />
    </div>
  );
}