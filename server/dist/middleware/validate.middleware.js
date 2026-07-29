"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const api_error_js_1 = require("../utils/api-error.js");
const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                }));
                return next(new api_error_js_1.ApiError(400, "Validation Failed", formattedErrors));
            }
            next(error);
        }
    };
};
exports.validate = validate;
