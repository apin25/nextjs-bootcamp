import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isCookiesExist = !!request.cookies.get("user_token");
  const isLoginPage = pathname.startsWith("/login");

  if (!isCookiesExist && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isCookiesExist && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
