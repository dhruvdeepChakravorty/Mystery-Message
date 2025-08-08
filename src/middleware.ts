import { NextResponse ,NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request}); // Will Get the Token, use req to define its type 
    const url= request.nextUrl // Will get CUrrent URL
    if (token && 
        (
            url.pathname.startsWith('/sign-in')|| // If token came and url starts with this all then the midellware will redirct to Dashboard
            url.pathname.startsWith('/sign-up')||
            url.pathname.startsWith('/verify')||
            url.pathname.startsWith('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token && url.pathname.startsWith('/dashboard') ) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in', // configures on which path to use middleware
    "/sign-up",
    '/',
    '/dashboard/:path*',
    '/verify/:path*',

  ],
}