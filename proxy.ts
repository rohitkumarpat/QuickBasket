import { get } from "http";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


export async function proxy(req: Request) {
  const {pathname} = new URL(req.url);
   const publicRoutes = [
  "/api/auth",
  "/favicon.ico",
  "/frontend/login",
  "/frontend/register",
  "/_next"
];

if(publicRoutes.some((path)=> pathname.startsWith(path))) {
return NextResponse.next();
}

const token=await getToken({ req, secret: process.env.BETTER_AUTH_SECRET });

if(!token) {
   const loginUrl = new URL("/frontend/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
}

const role=token.role;


if (pathname.startsWith("/frontend/admin") && role !== "admin") {
  return NextResponse.redirect(new URL("/frontend/unauthorized", req.url));
}


if (pathname.startsWith("/frontend/delivery") && role !== "deliveryboy") {
  return NextResponse.redirect(new URL("/frontend/unauthorized", req.url));
}

if (pathname.startsWith("frontend/user") && role !== "user") {
  return NextResponse.redirect(new URL("/frontend/unauthorized", req.url));
}

return NextResponse.next();     //aage bhej dega 

}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};