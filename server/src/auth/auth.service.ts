import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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

  async login(profile: any) {
    console.log('AuthService.login - profile:', profile);
    const { id: googleId, email, displayName } = profile;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId,
          email,
          name: displayName,
        },
      });
    }

    const payload = { userId: user.id, email: user.email, name: displayName };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30s',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return {
      access_token,
      refresh_token,
    };
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

      const payload = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };

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
