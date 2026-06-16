import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = new URL(req.url);
  
  const publicRoutes = [
    "/api/auth",
    "/favicon.ico",
    "/frontend/login",
    "/frontend/register",
    "/_next"
  ];

  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Fetch token using the correct NextAuth variables and production secure cookie handling
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });

  if (!token) {
    const loginUrl = new URL("/frontend/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role;

  if (pathname.startsWith("/frontend/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/frontend/unauthorized", req.url));
  }

  if (pathname.startsWith("/frontend/delivery") && role !== "deliveryboy") {
    return NextResponse.redirect(new URL("/frontend/unauthorized", req.url));
  }

  if (pathname.startsWith("/frontend/user") && role !== "user") {
    return NextResponse.redirect(new URL("/frontend/unauthorized", req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};