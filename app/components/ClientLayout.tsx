'use client';

import React, { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const mainRef = useRef<HTMLElement>(null);

    // Scroll to top on route change
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [pathname]);

    // Define paths where the sidebar should NOT appear
    const publicPaths = ['/', '/login', '/register', '/auth/callback', '/auth', '/about', '/contact', '/for-universities', '/privacy', '/terms', '/cookies'];
    const isPublic = publicPaths.includes(pathname) || pathname.startsWith('/onboarding');

    if (isPublic) {
        return <>{children}</>;
    }

    return (
        <div className="flex w-full h-screen overflow-hidden print:!block print:!h-auto print:!overflow-visible">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <main
                ref={mainRef}
                className="flex-1 overflow-y-auto relative print:!block print:!w-full print:!h-auto print:!overflow-visible print:!m-0 print:!p-0 flex flex-col"
            >
                <Header />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
