"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.status(200).json({
        status: "HEALTHY",
        service: "Nuvexora Technologies Backend API",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
exports.default = router;
