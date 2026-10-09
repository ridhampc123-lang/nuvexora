import { Request, Response } from "express";
import { PricingPlan } from "../models/pricing.model.js";
import { CurrencySetting } from "../models/currency.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import * as XLSX from "xlsx";

// Import all models for master export and emergency backups
import {
  Lead,
  ClientAccount,
  Project,
  Task,
  Employee,
  Department,
  Invoice,
  Payment,
  Proposal,
  Contract,
  Meeting,
  ContactMessage,
  Service,
  Blog,
  Portfolio,
  User,
  SiteSettings,
  Subscriber,
  Attendance,
  LeaveRequest,
  Ticket,
  Career
} from "../models/index.js";

// --- PUBLIC PRICING & CURRENCY ---

export const getPublicPricing = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await PricingPlan.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  const currencies = await CurrencySetting.find({ isActive: true }).sort({ order: 1, code: 1 });
  const defaultCurrency = (await CurrencySetting.findOne({ isDefault: true })) || {
    code: "USD",
    symbol: "$",
    exchangeRate: 1.0,
    format: "{{symbol}}{{amount}}"
  };

  return res.status(200).json(
    new ApiResponse(200, {
      plans,
      currencies,
      defaultCurrency
    }, "Pricing and currency configurations fetched successfully")
  );
});

export const getPublicCurrencies = asyncHandler(async (_req: Request, res: Response) => {
  const currencies = await CurrencySetting.find({ isActive: true }).sort({ order: 1, code: 1 });
  return res.status(200).json(
    new ApiResponse(200, currencies, "Active currencies fetched successfully")
  );
});

// --- ADMIN PRICING PLANS ---

export const getAdminPricing = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await PricingPlan.find().sort({ order: 1, createdAt: 1 });
  const total = plans.length;
  const activeCount = plans.filter((p) => p.isActive).length;
  const popularCount = plans.filter((p) => p.isPopular).length;

  return res.status(200).json(
    new ApiResponse(200, {
      plans,
      metrics: {
        total,
        activeCount,
        popularCount
      }
    }, "Admin pricing plans fetched successfully")
  );
});

export const createPricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    slug,
    badge,
    isPopular,
    isActive,
    order,
    description,
    monthlyPriceUSD,
    monthlyPriceINR,
    fixedPriceUSD,
    fixedPriceINR,
    annualDiscountPercent,
    deliveryTime,
    squadComposition,
    idealFor,
    highlightedFeatures,
    features,
    ctaText,
    ctaHref,
    customCurrencies
  } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Plan name and description are required");
  }

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await PricingPlan.findOne({ slug: generatedSlug });
  if (existing) {
    throw new ApiError(409, `A pricing plan with slug '${generatedSlug}' already exists`);
  }

  const plan = await PricingPlan.create({
    name,
    slug: generatedSlug,
    badge: badge || "",
    isPopular: !!isPopular,
    isActive: isActive !== undefined ? !!isActive : true,
    order: order !== undefined ? Number(order) : 0,
    description,
    monthlyPriceUSD: Number(monthlyPriceUSD) || 0,
    monthlyPriceINR: Number(monthlyPriceINR) || 0,
    fixedPriceUSD: Number(fixedPriceUSD) || 0,
    fixedPriceINR: Number(fixedPriceINR) || 0,
    annualDiscountPercent: Number(annualDiscountPercent) || 15,
    deliveryTime: deliveryTime || "4 to 6 Weeks",
    squadComposition: squadComposition || "Dedicated Squad",
    idealFor: idealFor || "",
    highlightedFeatures: Array.isArray(highlightedFeatures) ? highlightedFeatures : [],
    features: Array.isArray(features) ? features : [],
    ctaText: ctaText || "Get Started",
    ctaHref: ctaHref || "/book-consultation",
    customCurrencies: customCurrencies || {}
  });

  return res.status(201).json(new ApiResponse(201, plan, "Pricing plan created successfully"));
});

export const updatePricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const plan = await PricingPlan.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  if (!plan) {
    throw new ApiError(404, "Pricing plan not found");
  }

  return res.status(200).json(new ApiResponse(200, plan, "Pricing plan updated successfully"));
});

export const deletePricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = await PricingPlan.findByIdAndDelete(id);
  if (!plan) {
    throw new ApiError(404, "Pricing plan not found");
  }
  return res.status(200).json(new ApiResponse(200, null, "Pricing plan deleted successfully"));
});

export const reorderPricingPlans = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body; // Array of { id: string, order: number }
  if (!Array.isArray(items)) {
    throw new ApiError(400, "Items array expected");
  }

  const updatePromises = items.map((item) =>
    PricingPlan.findByIdAndUpdate(item.id, { $set: { order: item.order } })
  );
  await Promise.all(updatePromises);

  const updatedPlans = await PricingPlan.find().sort({ order: 1, createdAt: 1 });
  return res.status(200).json(new ApiResponse(200, updatedPlans, "Plans reordered successfully"));
});

// --- CURRENCY SETTINGS ---

export const getCurrencies = asyncHandler(async (_req: Request, res: Response) => {
  const currencies = await CurrencySetting.find().sort({ order: 1, code: 1 });
  return res.status(200).json(new ApiResponse(200, currencies, "Currencies fetched successfully"));
});

export const createCurrency = asyncHandler(async (req: Request, res: Response) => {
  const { code, name, symbol, exchangeRate, isDefault, isActive, order, format } = req.body;

  if (!code || !name || !symbol) {
    throw new ApiError(400, "Code, name, and symbol are required");
  }

  const upperCode = code.toUpperCase().trim();
  const existing = await CurrencySetting.findOne({ code: upperCode });
  if (existing) {
    throw new ApiError(409, `Currency with code '${upperCode}' already exists`);
  }

  if (isDefault) {
    await CurrencySetting.updateMany({}, { $set: { isDefault: false } });
  }

  const currency = await CurrencySetting.create({
    code: upperCode,
    name: name.trim(),
    symbol: symbol.trim(),
    exchangeRate: Number(exchangeRate) || 1.0,
    isDefault: !!isDefault,
    isActive: isActive !== undefined ? !!isActive : true,
    order: order !== undefined ? Number(order) : 0,
    format: format || "{{symbol}}{{amount}}"
  });

  return res.status(201).json(new ApiResponse(201, currency, "Currency created successfully"));
});

export const updateCurrency = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, name, symbol, exchangeRate, isDefault, isActive, order, format } = req.body;

  const updateData: any = {};
  if (code) updateData.code = code.toUpperCase().trim();
  if (name) updateData.name = name.trim();
  if (symbol) updateData.symbol = symbol.trim();
  if (exchangeRate !== undefined) updateData.exchangeRate = Number(exchangeRate);
  if (isActive !== undefined) updateData.isActive = !!isActive;
  if (order !== undefined) updateData.order = Number(order);
  if (format) updateData.format = format;

  if (isDefault) {
    await CurrencySetting.updateMany({}, { $set: { isDefault: false } });
    updateData.isDefault = true;
    updateData.isActive = true; // default must be active
  }

  const currency = await CurrencySetting.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  if (!currency) {
    throw new ApiError(404, "Currency not found");
  }

  return res.status(200).json(new ApiResponse(200, currency, "Currency updated successfully"));
});

export const deleteCurrency = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currency = await CurrencySetting.findById(id);
  if (!currency) {
    throw new ApiError(404, "Currency not found");
  }
  if (currency.isDefault) {
    throw new ApiError(400, "Cannot delete the default currency. Please assign another default currency first.");
  }
  await CurrencySetting.findByIdAndDelete(id);
  return res.status(200).json(new ApiResponse(200, null, "Currency deleted successfully"));
});

// --- MASTER DATA EXPORT (EXCEL WORKBOOK) ---

export const exportMasterExcel = asyncHandler(async (_req: Request, res: Response) => {
  // Fetch all collections in parallel
  const [
    leads,
    clients,
    projects,
    tasks,
    employees,
    invoices,
    payments,
    proposals,
    contracts,
    meetings,
    messages,
    services,
    blogs,
    portfolio,
    pricing,
    currencies,
    subscribers
  ] = await Promise.all([
    Lead.find().lean(),
    ClientAccount.find().lean(),
    Project.find().lean(),
    Task.find().lean(),
    Employee.find().lean(),
    Invoice.find().lean(),
    Payment.find().lean(),
    Proposal.find().lean(),
    Contract.find().lean(),
    Meeting.find().lean(),
    ContactMessage.find().lean(),
    Service.find().lean(),
    Blog.find().lean(),
    Portfolio.find().lean(),
    PricingPlan.find().lean(),
    CurrencySetting.find().lean(),
    Subscriber.find().lean()
  ]);

  const wb = XLSX.utils.book_new();

  const addSheet = (data: any[], sheetName: string) => {
    const sanitized = (data || []).map((row) => {
      const cleanRow: Record<string, any> = {};
      for (const [key, val] of Object.entries(row)) {
        if (key === "__v" || key === "password") continue;
        if (typeof val === "object" && val !== null) {
          cleanRow[key] = JSON.stringify(val);
        } else {
          cleanRow[key] = val;
        }
      }
      return cleanRow;
    });

    const ws = sanitized.length > 0 ? XLSX.utils.json_to_sheet(sanitized) : XLSX.utils.aoa_to_sheet([["No records found"]]);
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  };

  // Add sheets for all core business domains
  addSheet(leads, "Leads");
  addSheet(clients, "Clients");
  addSheet(projects, "Projects");
  addSheet(tasks, "Tasks");
  addSheet(employees, "Employees");
  addSheet(invoices, "Invoices");
  addSheet(payments, "Payments");
  addSheet(proposals, "Proposals");
  addSheet(contracts, "Contracts");
  addSheet(meetings, "Meetings");
  addSheet(messages, "Contact Messages");
  addSheet(pricing, "Pricing Plans");
  addSheet(currencies, "Currencies");
  addSheet(services, "Services");
  addSheet(blogs, "Blogs");
  addSheet(portfolio, "Portfolio");
  addSheet(subscribers, "Subscribers");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const filename = `Nuvexora_Master_Export_${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(buffer);
});

// --- MASTER DATA JSON SNAPSHOT & EMERGENCY BACKUP ---

export const getMasterDataSnapshot = asyncHandler(async (_req: Request, res: Response) => {
  const [
    leads,
    clients,
    projects,
    tasks,
    employees,
    departments,
    invoices,
    payments,
    proposals,
    contracts,
    meetings,
    messages,
    services,
    blogs,
    portfolio,
    pricing,
    currencies,
    subscribers,
    tickets,
    careers,
    siteSettings
  ] = await Promise.all([
    Lead.find().lean(),
    ClientAccount.find().lean(),
    Project.find().lean(),
    Task.find().lean(),
    Employee.find().lean(),
    Department.find().lean(),
    Invoice.find().lean(),
    Payment.find().lean(),
    Proposal.find().lean(),
    Contract.find().lean(),
    Meeting.find().lean(),
    ContactMessage.find().lean(),
    Service.find().lean(),
    Blog.find().lean(),
    Portfolio.find().lean(),
    PricingPlan.find().lean(),
    CurrencySetting.find().lean(),
    Subscriber.find().lean(),
    Ticket.find().lean(),
    Career.find().lean(),
    SiteSettings.find().lean()
  ]);

  const snapshot = {
    version: "2.0",
    system: "Nuvexora Technologies Enterprise Core",
    timestamp: new Date().toISOString(),
    collections: {
      leads,
      clients,
      projects,
      tasks,
      employees,
      departments,
      invoices,
      payments,
      proposals,
      contracts,
      meetings,
      messages,
      services,
      blogs,
      portfolio,
      pricing,
      currencies,
      subscribers,
      tickets,
      careers,
      siteSettings
    },
    counts: {
      leads: leads.length,
      clients: clients.length,
      projects: projects.length,
      tasks: tasks.length,
      employees: employees.length,
      departments: departments.length,
      invoices: invoices.length,
      payments: payments.length,
      proposals: proposals.length,
      contracts: contracts.length,
      meetings: meetings.length,
      messages: messages.length,
      services: services.length,
      blogs: blogs.length,
      portfolio: portfolio.length,
      pricing: pricing.length,
      currencies: currencies.length,
      subscribers: subscribers.length,
      tickets: tickets.length,
      careers: careers.length
    }
  };

  return res.status(200).json(
    new ApiResponse(200, snapshot, "Emergency backup snapshot generated successfully")
  );
});

export const restoreEmergencyBackup = asyncHandler(async (req: Request, res: Response) => {
  const { collections } = req.body;
  if (!collections || typeof collections !== "object") {
    throw new ApiError(400, "Invalid backup snapshot payload: collections object required");
  }

  const restoreLog: Record<string, number> = {};

  if (Array.isArray(collections.pricing)) {
    for (const item of collections.pricing) {
      const { _id, ...doc } = item;
      await PricingPlan.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
    }
    restoreLog.pricing = collections.pricing.length;
  }

  if (Array.isArray(collections.currencies)) {
    for (const item of collections.currencies) {
      const { _id, ...doc } = item;
      await CurrencySetting.findOneAndUpdate({ code: doc.code }, { $set: doc }, { upsert: true });
    }
    restoreLog.currencies = collections.currencies.length;
  }

  if (Array.isArray(collections.leads)) {
    for (const item of collections.leads) {
      const { _id, ...doc } = item;
      if (doc.email) {
        await Lead.findOneAndUpdate({ email: doc.email }, { $set: doc }, { upsert: true });
      }
    }
    restoreLog.leads = collections.leads.length;
  }

  if (Array.isArray(collections.services)) {
    for (const item of collections.services) {
      const { _id, ...doc } = item;
      if (doc.slug) {
        await Service.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
      }
    }
    restoreLog.services = collections.services.length;
  }

  if (Array.isArray(collections.blogs)) {
    for (const item of collections.blogs) {
      const { _id, ...doc } = item;
      if (doc.slug) {
        await Blog.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
      }
    }
    restoreLog.blogs = collections.blogs.length;
  }

  if (Array.isArray(collections.portfolio)) {
    for (const item of collections.portfolio) {
      const { _id, ...doc } = item;
      if (doc.slug) {
        await Portfolio.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
      }
    }
    restoreLog.portfolio = collections.portfolio.length;
  }

  return res.status(200).json(
    new ApiResponse(200, { restoreLog, restoredAt: new Date().toISOString() }, "Backup restored successfully")
  );
});
