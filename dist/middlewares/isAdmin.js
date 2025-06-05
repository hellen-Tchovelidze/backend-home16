"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    const role = req.headers['role'];
    if (role !== 'admin')
        return res.status(403).json({ error: 'Access denied' });
    next();
};
exports.isAdmin = isAdmin;
