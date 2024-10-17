import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: String;
  email: String;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  const publicRoutes = ['/login', '/'];
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const jwt = request.cookies.get('jwt')?.value;

  if (!jwt && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (jwt) {
    const decodedToken: JwtPayload = jwtDecode(jwt);
    console.log(decodedToken);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
