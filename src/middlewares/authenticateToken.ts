import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
  role: 'admin' | 'user';
}

interface CustomRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided.' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "default_secret" as string, (err, decoded) => {
    if (err) {
      console.log(err)
      res.status(403).json({ message: 'Forbidden: Invalid token.' });
      return;
    }
    const { id, role } = decoded as CustomJwtPayload;
    req.user = { id, role };
    next();
  });
};
