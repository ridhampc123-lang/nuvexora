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
exports.HomepageContent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HomepageContentSchema = new mongoose_1.Schema({
    heroBadge: { type: String, default: "Trusted Technology Partner" },
    heroHeadline: { type: String, default: "Architecting Enterprise Platforms. Engineering Digital Excellence." },
    heroSubheadline: { type: String, default: "High-performance software, cloud architectures, and bespoke AI." },
    statsProjects: { type: String, default: "100+" },
    statsClients: { type: String, default: "50+" },
    statsIndustries: { type: String, default: "10+" },
    statsSatisfaction: { type: String, default: "99%" },
}, { timestamps: true });
exports.HomepageContent = mongoose_1.default.model("HomepageContent", HomepageContentSchema);
