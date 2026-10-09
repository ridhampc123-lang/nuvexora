import mongoose, { Schema, Document } from "mongoose";

export interface ICurrencySetting extends Document {
  code: string; // e.g. "USD", "EUR", "GBP", "INR", "CAD", "AUD", "AED", "JPY", "SGD", etc.
  name: string; // e.g. "US Dollar", "Euro", "British Pound"
  symbol: string; // e.g. "$", "€", "£", "₹", "C$", "A$", "AED"
  exchangeRate: number; // Rate relative to 1 USD (USD = 1.0)
  isDefault: boolean;
  isActive: boolean;
  order: number;
  format: string; // e.g. "{{symbol}}{{amount}}"
  createdAt: Date;
  updatedAt: Date;
}

const CurrencySettingSchema = new Schema<ICurrencySetting>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    symbol: { type: String, required: true, trim: true },
    exchangeRate: { type: Number, required: true, default: 1.0 },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    format: { type: String, default: "{{symbol}}{{amount}}" },
  },
  { timestamps: true }
);

export const CurrencySetting = mongoose.model<ICurrencySetting>("CurrencySetting", CurrencySettingSchema);
