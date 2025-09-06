import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";

  console.log("cookieName", cookieName);

  const token = await getToken({
    req: request,
    cookieName,
  });

  console.log("token", token);

  const { pathname } = request.nextUrl;

  const authRoutes = ["/login", "/register"];
  const protectedRoutes = ["/cart", "/checkout", "/profile", "/orders"];

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/cart", "/checkout", "/profile", "/orders", "/login", "/register"],
};
