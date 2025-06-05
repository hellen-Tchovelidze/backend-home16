import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers['role'];
  if (role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  next();
};
