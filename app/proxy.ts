import { get } from "http";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req: Request) {
      console.log("MIDDLEWARE RUNNING:", req.url);
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
return NextResponse.next();


}