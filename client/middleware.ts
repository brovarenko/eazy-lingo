import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function middleware(request: NextRequest) {
  const publicRoutes = ['/login', '/'];
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!refreshToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
