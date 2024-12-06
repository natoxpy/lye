'use client'
import AppProvider from '@/store/provider'
import PlayerAudioProvider from '@/app/components/player/component'
import { useEffect } from 'react'
import { usePlainLyrics } from '@/states/plain-lyrics'
import { UNAME } from '@/utils/units'

export default function Layout({
    children,
    navigation,
    header,
}: {
    children: React.ReactNode
    navigation: React.ReactNode
    header: React.ReactNode
}) {
    const create = usePlainLyrics((state) => state.actions.createLyrics)
    const lyrics = usePlainLyrics((state) => state.lyrics)

    useEffect(() => {
        create('1' as UNAME, 'main' as UNAME, '') // Testing Plain Lyrics
    })

    useEffect(() => {
        const lines = lyrics.find((i) => i.workspace === ('main' as UNAME))
        if (lines === undefined) return
    }, [lyrics])

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
