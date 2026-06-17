export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protect all routes except login, api/auth, api/seed, and static assets.
     */
    "/((?!login|api/auth|api/seed|_next/static|_next/image|favicon.ico).*)",
  ],
};
