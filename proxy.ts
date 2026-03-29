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
return NextResponse.next();     //aage bhej dega 


}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (static files)
     * - images
     * - favicon
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};