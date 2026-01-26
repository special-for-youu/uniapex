import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from './components/ClientLayout'

export const metadata: Metadata = {
    title: 'UNIAPEX - Your University Admission Companion',
    description: 'Super-App for students in Kazakhstan: university admission, test preparation (IELTS, SAT, UNT), and career planning.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    )
}
