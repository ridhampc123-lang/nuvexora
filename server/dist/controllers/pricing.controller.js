"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreEmergencyBackup = exports.getMasterDataSnapshot = exports.exportMasterExcel = exports.deleteCurrency = exports.updateCurrency = exports.createCurrency = exports.getCurrencies = exports.reorderPricingPlans = exports.deletePricingPlan = exports.updatePricingPlan = exports.createPricingPlan = exports.getAdminPricing = exports.getPublicCurrencies = exports.getPublicPricing = void 0;
const pricing_model_js_1 = require("../models/pricing.model.js");
const currency_model_js_1 = require("../models/currency.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
const XLSX = __importStar(require("xlsx"));
// Import all models for master export and emergency backups
const index_js_1 = require("../models/index.js");
// --- PUBLIC PRICING & CURRENCY ---
exports.getPublicPricing = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const plans = await pricing_model_js_1.PricingPlan.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    const currencies = await currency_model_js_1.CurrencySetting.find({ isActive: true }).sort({ order: 1, code: 1 });
    const defaultCurrency = (await currency_model_js_1.CurrencySetting.findOne({ isDefault: true })) || {
        code: "USD",
        symbol: "$",
        exchangeRate: 1.0,
        format: "{{symbol}}{{amount}}"
    };
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        plans,
        currencies,
        defaultCurrency
    }, "Pricing and currency configurations fetched successfully"));
});
exports.getPublicCurrencies = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const currencies = await currency_model_js_1.CurrencySetting.find({ isActive: true }).sort({ order: 1, code: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, currencies, "Active currencies fetched successfully"));
});
// --- ADMIN PRICING PLANS ---
exports.getAdminPricing = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const plans = await pricing_model_js_1.PricingPlan.find().sort({ order: 1, createdAt: 1 });
    const total = plans.length;
    const activeCount = plans.filter((p) => p.isActive).length;
    const popularCount = plans.filter((p) => p.isPopular).length;
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        plans,
        metrics: {
            total,
            activeCount,
            popularCount
        }
    }, "Admin pricing plans fetched successfully"));
});
exports.createPricingPlan = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { name, slug, badge, isPopular, isActive, order, description, monthlyPriceUSD, monthlyPriceINR, fixedPriceUSD, fixedPriceINR, annualDiscountPercent, deliveryTime, squadComposition, idealFor, highlightedFeatures, features, ctaText, ctaHref, customCurrencies } = req.body;
    if (!name || !description) {
        throw new api_error_js_1.ApiError(400, "Plan name and description are required");
    }
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const existing = await pricing_model_js_1.PricingPlan.findOne({ slug: generatedSlug });
    if (existing) {
        throw new api_error_js_1.ApiError(409, `A pricing plan with slug '${generatedSlug}' already exists`);
    }
    const plan = await pricing_model_js_1.PricingPlan.create({
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
    return res.status(201).json(new api_response_js_1.ApiResponse(201, plan, "Pricing plan created successfully"));
});
exports.updatePricingPlan = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.name && !updateData.slug) {
        updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const plan = await pricing_model_js_1.PricingPlan.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!plan) {
        throw new api_error_js_1.ApiError(404, "Pricing plan not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, plan, "Pricing plan updated successfully"));
});
exports.deletePricingPlan = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const plan = await pricing_model_js_1.PricingPlan.findByIdAndDelete(id);
    if (!plan) {
        throw new api_error_js_1.ApiError(404, "Pricing plan not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Pricing plan deleted successfully"));
});
exports.reorderPricingPlans = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { items } = req.body; // Array of { id: string, order: number }
    if (!Array.isArray(items)) {
        throw new api_error_js_1.ApiError(400, "Items array expected");
    }
    const updatePromises = items.map((item) => pricing_model_js_1.PricingPlan.findByIdAndUpdate(item.id, { $set: { order: item.order } }));
    await Promise.all(updatePromises);
    const updatedPlans = await pricing_model_js_1.PricingPlan.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, updatedPlans, "Plans reordered successfully"));
});
// --- CURRENCY SETTINGS ---
exports.getCurrencies = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const currencies = await currency_model_js_1.CurrencySetting.find().sort({ order: 1, code: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, currencies, "Currencies fetched successfully"));
});
exports.createCurrency = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { code, name, symbol, exchangeRate, isDefault, isActive, order, format } = req.body;
    if (!code || !name || !symbol) {
        throw new api_error_js_1.ApiError(400, "Code, name, and symbol are required");
    }
    const upperCode = code.toUpperCase().trim();
    const existing = await currency_model_js_1.CurrencySetting.findOne({ code: upperCode });
    if (existing) {
        throw new api_error_js_1.ApiError(409, `Currency with code '${upperCode}' already exists`);
    }
    if (isDefault) {
        await currency_model_js_1.CurrencySetting.updateMany({}, { $set: { isDefault: false } });
    }
    const currency = await currency_model_js_1.CurrencySetting.create({
        code: upperCode,
        name: name.trim(),
        symbol: symbol.trim(),
        exchangeRate: Number(exchangeRate) || 1.0,
        isDefault: !!isDefault,
        isActive: isActive !== undefined ? !!isActive : true,
        order: order !== undefined ? Number(order) : 0,
        format: format || "{{symbol}}{{amount}}"
    });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, currency, "Currency created successfully"));
});
exports.updateCurrency = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { code, name, symbol, exchangeRate, isDefault, isActive, order, format } = req.body;
    const updateData = {};
    if (code)
        updateData.code = code.toUpperCase().trim();
    if (name)
        updateData.name = name.trim();
    if (symbol)
        updateData.symbol = symbol.trim();
    if (exchangeRate !== undefined)
        updateData.exchangeRate = Number(exchangeRate);
    if (isActive !== undefined)
        updateData.isActive = !!isActive;
    if (order !== undefined)
        updateData.order = Number(order);
    if (format)
        updateData.format = format;
    if (isDefault) {
        await currency_model_js_1.CurrencySetting.updateMany({}, { $set: { isDefault: false } });
        updateData.isDefault = true;
        updateData.isActive = true; // default must be active
    }
    const currency = await currency_model_js_1.CurrencySetting.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!currency) {
        throw new api_error_js_1.ApiError(404, "Currency not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, currency, "Currency updated successfully"));
});
exports.deleteCurrency = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const currency = await currency_model_js_1.CurrencySetting.findById(id);
    if (!currency) {
        throw new api_error_js_1.ApiError(404, "Currency not found");
    }
    if (currency.isDefault) {
        throw new api_error_js_1.ApiError(400, "Cannot delete the default currency. Please assign another default currency first.");
    }
    await currency_model_js_1.CurrencySetting.findByIdAndDelete(id);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Currency deleted successfully"));
});
// --- MASTER DATA EXPORT (EXCEL WORKBOOK) ---
exports.exportMasterExcel = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    // Fetch all collections in parallel
    const [leads, clients, projects, tasks, employees, invoices, payments, proposals, contracts, meetings, messages, services, blogs, portfolio, pricing, currencies, subscribers] = await Promise.all([
        index_js_1.Lead.find().lean(),
        index_js_1.ClientAccount.find().lean(),
        index_js_1.Project.find().lean(),
        index_js_1.Task.find().lean(),
        index_js_1.Employee.find().lean(),
        index_js_1.Invoice.find().lean(),
        index_js_1.Payment.find().lean(),
        index_js_1.Proposal.find().lean(),
        index_js_1.Contract.find().lean(),
        index_js_1.Meeting.find().lean(),
        index_js_1.ContactMessage.find().lean(),
        index_js_1.Service.find().lean(),
        index_js_1.Blog.find().lean(),
        index_js_1.Portfolio.find().lean(),
        pricing_model_js_1.PricingPlan.find().lean(),
        currency_model_js_1.CurrencySetting.find().lean(),
        index_js_1.Subscriber.find().lean()
    ]);
    const wb = XLSX.utils.book_new();
    const addSheet = (data, sheetName) => {
        const sanitized = (data || []).map((row) => {
            const cleanRow = {};
            for (const [key, val] of Object.entries(row)) {
                if (key === "__v" || key === "password")
                    continue;
                if (typeof val === "object" && val !== null) {
                    cleanRow[key] = JSON.stringify(val);
                }
                else {
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
exports.getMasterDataSnapshot = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const [leads, clients, projects, tasks, employees, departments, invoices, payments, proposals, contracts, meetings, messages, services, blogs, portfolio, pricing, currencies, subscribers, tickets, careers, caseStudies, siteSettings] = await Promise.all([
        index_js_1.Lead.find().lean(),
        index_js_1.ClientAccount.find().lean(),
        index_js_1.Project.find().lean(),
        index_js_1.Task.find().lean(),
        index_js_1.Employee.find().lean(),
        index_js_1.Department.find().lean(),
        index_js_1.Invoice.find().lean(),
        index_js_1.Payment.find().lean(),
        index_js_1.Proposal.find().lean(),
        index_js_1.Contract.find().lean(),
        index_js_1.Meeting.find().lean(),
        index_js_1.ContactMessage.find().lean(),
        index_js_1.Service.find().lean(),
        index_js_1.Blog.find().lean(),
        index_js_1.Portfolio.find().lean(),
        pricing_model_js_1.PricingPlan.find().lean(),
        currency_model_js_1.CurrencySetting.find().lean(),
        index_js_1.Subscriber.find().lean(),
        index_js_1.Ticket.find().lean(),
        index_js_1.Career.find().lean(),
        index_js_1.CaseStudy.find().lean(),
        index_js_1.SiteSettings.find().lean()
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
            caseStudies,
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
    return res.status(200).json(new api_response_js_1.ApiResponse(200, snapshot, "Emergency backup snapshot generated successfully"));
});
exports.restoreEmergencyBackup = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { collections } = req.body;
    if (!collections || typeof collections !== "object") {
        throw new api_error_js_1.ApiError(400, "Invalid backup snapshot payload: collections object required");
    }
    const restoreLog = {};
    if (Array.isArray(collections.pricing)) {
        for (const item of collections.pricing) {
            const { _id, ...doc } = item;
            await pricing_model_js_1.PricingPlan.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
        }
        restoreLog.pricing = collections.pricing.length;
    }
    if (Array.isArray(collections.currencies)) {
        for (const item of collections.currencies) {
            const { _id, ...doc } = item;
            await currency_model_js_1.CurrencySetting.findOneAndUpdate({ code: doc.code }, { $set: doc }, { upsert: true });
        }
        restoreLog.currencies = collections.currencies.length;
    }
    if (Array.isArray(collections.leads)) {
        for (const item of collections.leads) {
            const { _id, ...doc } = item;
            if (doc.email) {
                await index_js_1.Lead.findOneAndUpdate({ email: doc.email }, { $set: doc }, { upsert: true });
            }
        }
        restoreLog.leads = collections.leads.length;
    }
    if (Array.isArray(collections.services)) {
        for (const item of collections.services) {
            const { _id, ...doc } = item;
            if (doc.slug) {
                await index_js_1.Service.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
            }
        }
        restoreLog.services = collections.services.length;
    }
    if (Array.isArray(collections.blogs)) {
        for (const item of collections.blogs) {
            const { _id, ...doc } = item;
            if (doc.slug) {
                await index_js_1.Blog.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
            }
        }
        restoreLog.blogs = collections.blogs.length;
    }
    if (Array.isArray(collections.portfolio)) {
        for (const item of collections.portfolio) {
            const { _id, ...doc } = item;
            if (doc.slug) {
                await index_js_1.Portfolio.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true });
            }
        }
        restoreLog.portfolio = collections.portfolio.length;
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { restoreLog, restoredAt: new Date().toISOString() }, "Backup restored successfully"));
});
