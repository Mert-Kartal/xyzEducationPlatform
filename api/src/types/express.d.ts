export interface TokenPayload {
  userId: string;
  role: string;
  jti?: string;
}
declare global {
  namespace Express {
    interface Request {
      user: TokenPayload;
    }
  }
}
