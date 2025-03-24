'use client'
import { useEffect } from 'react'
import { loadAll } from '@/states/persistance'

export default function Layout({
    children,
    header,
}: {
    children: React.ReactNode
    header: React.ReactNode
}) {
    useEffect(() => {
        loadAll()
    }, [])

    return (
        <div className="flex-col w-screen max-h-screen h-screen bg-bg-4 flex overflow-hidden">
            {header}
            {children}
        </div>
    )
}
