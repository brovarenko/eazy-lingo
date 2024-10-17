import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async validateOAuthLogin(profile: any): Promise<string> {
    const { id, emails, displayName } = profile;
    const userEmail = emails[0].value;

    const user = {
      id,
      email: userEmail,
      name: displayName,
    };

    const payload = { userId: user.id, email: user.email };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
  }
  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);

      const payload = { username: decoded.username, sub: decoded.sub };

      const newAccessToken = this.generateAccessToken(payload);

      return {
        access_token: newAccessToken,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new Error('Unable to refresh token');
    }
  }
}
