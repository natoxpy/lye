import '../themes/globals.scss'
import type { Metadata } from 'next'
export const metadata: Metadata = {
    title: 'Lye',
    description: 'The best editor to sync your lyrics',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" data-theme="dark">
            <body className={`antialiased`}>{children}</body>
        </html>
    )
}
