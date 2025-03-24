'use client'
import AppProvider from '@/store/provider'
import PlayerAudioProvider from '@/app/components/player/component'
// import { useEffect } from 'react'
// import { usePlainLyrics } from '@/states/plain-lyrics'
// import { UNAME } from '@/utils/units'

export default function Layout({
    children,
    navigation,
}: {
    children: React.ReactNode
    navigation: React.ReactNode
}) {
    return (
        <AppProvider>
            <PlayerAudioProvider>
                <div className="flex-col w-screen max-h-screen h-screen bg-bg-4 flex overflow-hidden">
                    {children}
                    {navigation}
                </div>
            </PlayerAudioProvider>
        </AppProvider>
    )
}
