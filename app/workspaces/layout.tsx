'use client'
import AppProvider from '@/store/provider'
import PlayerAudioProvider from '@/app/components/player/component'
import { useEffect, useState } from 'react'
import { loadAll, saveAll } from '@/states/persistance'

export default function Layout({
    children,
    navigation,
    header,
}: {
    children: React.ReactNode
    navigation: React.ReactNode
    header: React.ReactNode
}) {
    const [state, setState] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (state != null) return
        loadAll()
        setState(setInterval(saveAll, 5000))
    }, [state])

    return (
        <AppProvider>
            <PlayerAudioProvider>
                <div className="flex-col w-screen max-h-screen h-screen bg-bg-4 flex overflow-hidden">
                    {header}
                    {children}
                    {navigation}
                </div>
            </PlayerAudioProvider>
        </AppProvider>
    )
}
