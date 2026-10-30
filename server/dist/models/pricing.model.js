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
exports.PricingPlan = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PricingPlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    badge: { type: String, default: "" },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    description: { type: String, required: true },
    monthlyPriceUSD: { type: Number, required: true, default: 0 },
    monthlyPriceINR: { type: Number, required: true, default: 0 },
    fixedPriceUSD: { type: Number, required: true, default: 0 },
    fixedPriceINR: { type: Number, required: true, default: 0 },
    annualDiscountPercent: { type: Number, default: 15 },
    deliveryTime: { type: String, default: "4 to 6 Weeks" },
    squadComposition: { type: String, default: "Fullstack Lead + UI/UX" },
    idealFor: { type: String, default: "" },
    highlightedFeatures: [{ type: String }],
    features: [
        {
            category: { type: String, required: true },
            items: [{ type: String }],
        },
    ],
    ctaText: { type: String, default: "Get Started" },
    ctaHref: { type: String, default: "/book-consultation" },
    customCurrencies: {
        type: Map,
        of: new mongoose_1.Schema({
            monthlyPrice: { type: Number, default: 0 },
            fixedPrice: { type: Number, default: 0 },
        }, { _id: false }),
        default: {},
    },
}, { timestamps: true });
exports.PricingPlan = mongoose_1.default.model("PricingPlan", PricingPlanSchema);
