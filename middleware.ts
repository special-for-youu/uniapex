import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    let session = null

    try {
        const { data } = await supabase.auth.getSession()
        session = data.session
    } catch (error) {
        // If auth fails, continue without session
        console.error('Middleware auth error:', error)
    }

    // Protected routes that require authentication
    const protectedPaths = ['/dashboard', '/profile', '/universities', '/extracurriculars', '/ai-tutor', '/career-test']
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))

    // Redirect to auth if accessing protected route without session
    if (isProtectedPath && !session) {
        const redirectUrl = new URL('/auth', req.url)
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // Redirect to profile if accessing auth page with active session
    if (req.nextUrl.pathname === '/auth' && session) {
        const redirectTo = req.nextUrl.searchParams.get('redirectTo')
        return NextResponse.redirect(new URL(redirectTo || '/profile', req.url))
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/universities/:path*', '/extracurriculars/:path*', '/ai-tutor/:path*', '/career-test/:path*', '/auth'],
}
