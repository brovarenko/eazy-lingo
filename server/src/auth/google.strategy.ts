import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:4000/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log('Google OAuth profile:', profile);
      console.log('Access token:', accessToken);

      if (!profile || !profile.emails || !profile.emails[0]) {
        console.error('Invalid profile data:', profile);
        return done(new Error('Invalid profile data'), false);
      }

      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
      };

      console.log('Validated user:', user);
      done(null, user);
    } catch (err) {
      console.error('Google OAuth validation error:', err);
      done(err, false);
    }
  }
}
