import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User extends JwtPayload {
      id: string;
      role: 'admin' | 'user';
    }

    interface Request {
      user?: User; // Add `user` property to the Request interface
    }
  }
}
