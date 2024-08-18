import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
  getAuth,
} from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/home(.*)', '/forum(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export async function middleware(req: NextRequest) {
  //const { userId, sessionId } = getAuth(req);
  const user = await currentUser();
  console.log(user);
  // if (userId && sessionId) {
  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     const userEmail = req.headers.get('x-clerk-email') || '';

  //     await prisma.user.create({
  //       data: {
  //         id: userId,
  //         email: userEmail,
  //       },
  //     });
  // }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
