export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Bypass middleware for static files including images in public/uploads/images
  if (pathname.startsWith("/uploads/images/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("session")?.value || "";
    const payload = await verifyJwtEdge(token);
    if (!payload) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
