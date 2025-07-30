import { Role } from '@prisma/client';
export interface TokenPayload {
  userId: string;
  role: Role;
  jti?: string;
}
declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}
