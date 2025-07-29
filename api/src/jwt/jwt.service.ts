import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma';
import { TokenPayload } from '../types/express';

@Injectable()
export class JwtService {
  constructor(private readonly prisma: PrismaService) {}

  private extractTokenFromHeader(header: string) {
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    return header.split(' ')[1];
  }

  private decodeToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      );
      console.log(decoded);
      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async revokeToken(token: string) {
    const decoded = this.decodeToken(token) as TokenPayload;

    const tokenInfo = await this.prisma.token.findUnique({
      where: { id: decoded.jti as string },
    });

    if (!tokenInfo) {
      throw new UnauthorizedException('Invalid token');
    }

    if (tokenInfo.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired');
    }

    if (tokenInfo.revokedAt) {
      throw new UnauthorizedException('Token has been revoked');
    }

    await this.prisma.token.update({
      where: { id: tokenInfo.id },
      data: { revokedAt: new Date() },
    });
  }

  generateAccess(userId: string, role: string) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_ACCESS_SECRET || 'access_secret',
      {
        expiresIn: '30m',
      },
    );
  }

  async generateRefresh(userId: string) {
    const tokenRecord = await this.prisma.token.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return jwt.sign(
      { userId, jti: tokenRecord.id },
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      {
        expiresIn: '7d',
      },
    );
  }

  async generateTokenPair(payload: TokenPayload) {
    const accessToken = this.generateAccess(payload.userId, payload.role);
    const refreshToken = await this.generateRefresh(payload.userId);
    return { accessToken, refreshToken };
  }

  verifyToken(token: string, secret: string) {
    try {
      const decoded = jwt.verify(token, secret);
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }
      return decoded;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(header: string) {
    const refreshToken = this.extractTokenFromHeader(header);

    await this.revokeToken(refreshToken);

    return { message: 'Logged out successfully' };
  }

  async refresh(header: string) {
    const token = this.extractTokenFromHeader(header);

    await this.revokeToken(token);

    const decoded = this.decodeToken(token) as TokenPayload;

    const { accessToken, refreshToken } = await this.generateTokenPair(decoded);

    return { accessToken, refreshToken };
  }
}
