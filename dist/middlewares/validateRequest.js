"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: 'Invalid request data', details: error.details.map(detail => detail.message) });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
