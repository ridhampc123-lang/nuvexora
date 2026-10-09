"use client";

import React, { useState, useEffect } from "react";
import {
  PricingHero,
  PricingCards,
  PricingEstimator,
  PricingRoiBanner,
  PricingModels,
  PricingComparisonTable,
  PricingGuarantees,
  PricingFAQ,
  CurrencyOption,
  BillingCycle,
} from "@/components/sections/pricing";
import { TrustedCompanies } from "@/components/sections/trusted-companies";
import { CTA } from "@/components/sections/cta";
import { PRICING_PLANS } from "@/data/pricing-data";
import { getPublicPricingData } from "@/lib/api/public-api";

const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.79 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 86.5 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", exchangeRate: 1.38 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", exchangeRate: 1.55 },
  { code: "AED", name: "UAE Dirham", symbol: "AED", exchangeRate: 3.67 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", exchangeRate: 1.34 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", exchangeRate: 152.0 },
];

export function PricingInteractiveView() {
  const [plans, setPlans] = useState<any[]>(PRICING_PLANS);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>(DEFAULT_CURRENCIES);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Fetch dynamic plans & currencies from API
  useEffect(() => {
    async function fetchDynamicData() {
      try {
        const res = await getPublicPricingData();
        if (res) {
          if (Array.isArray(res.plans) && res.plans.length > 0) {
            setPlans(res.plans);
          }
          if (Array.isArray(res.currencies) && res.currencies.length > 0) {
            setCurrencies(res.currencies);
            if (res.defaultCurrency?.code) {
              setSelectedCurrency(res.defaultCurrency.code);
            }
          }
        }
      } catch (err) {
        console.warn("Using offline pricing fallback", err);
      }
    }
    fetchDynamicData();
  }, []);

  const currentCurrencyObj =
    currencies.find((c) => c.code === selectedCurrency) || currencies[0] || DEFAULT_CURRENCIES[0];

  return (
    <>
      {/* 1. Hero Section with Dynamic Multi-Currency & Billing Cadence Toggles */}
      <PricingHero
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
      />

      {/* 2. Trusted By Global Enterprises Marquee */}
      <TrustedCompanies />

      {/* 3. Dynamic Core Pricing Plans / Cards */}
      <PricingCards
        plans={plans}
        currency={currentCurrencyObj}
        billingCycle={billingCycle}
      />

      {/* 4. Interactive Scope & Cost Estimator in Selected Currency */}
      <PricingEstimator currency={currentCurrencyObj} />

      {/* 5. Economic ROI & Comparison vs. In-House / Freelance */}
      <PricingRoiBanner />

      {/* 6. Three Agile Engagement Models */}
      <PricingModels />

      {/* 7. Comprehensive Feature & SLA Matrix */}
      <PricingComparisonTable />

      {/* 8. Enterprise Guarantees (100% IP, 14-Day Trial, NDA) */}
      <PricingGuarantees />

      {/* 9. Commercial Frequently Asked Questions */}
      <PricingFAQ />

      {/* 10. High-Conversion Final Call to Action */}
      <CTA />
    </>
  );
}
