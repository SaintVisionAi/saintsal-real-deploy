// Simple session-based authentication without bcrypt/jwt
import type { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Simple middleware to check if user is authenticated
export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.session && (req.session as any).user) {
    req.user = (req.session as any).user;
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Helper to set user session
export const setUserSession = (req: AuthenticatedRequest, user: any) => {
  if (req.session) {
    (req.session as any).user = user;
  }
};

// Helper to clear user session
export const clearUserSession = (req: AuthenticatedRequest) => {
  if (req.session) {
    (req.session as any).user = null;
  }
};