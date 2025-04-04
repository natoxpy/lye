'use client'
import { useEffect } from 'react'
import { loadAll } from '@/states/persistance'

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    useEffect(() => {
        console.log('load');
        loadAll()
    }, [])

    return (
        <div className="flex-col w-screen max-h-screen h-screen bg-bg-4 flex overflow-hidden">
            {children}
        </div>
    )
}
