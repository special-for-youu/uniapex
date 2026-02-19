import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export default async function proxy(request: NextRequest) {
    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin') {
        const adminSession = request.cookies.get('admin_session')
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    // Redirect to admin dashboard if accessing login page with active session
    if (request.nextUrl.pathname === '/admin') {
        const adminSession = request.cookies.get('admin_session')
        if (adminSession) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
