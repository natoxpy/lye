'use client'
import AppProvider from '@/store/provider'
import PlayerAudioProvider from '@/app/components/player/component'

export default function layout({
    children,
    navigation,
    header,
}: {
    children: React.ReactNode
    navigation: React.ReactNode
    header: React.ReactNode
}) {
    return (
        <AppProvider>
            <PlayerAudioProvider>
                <div className="flex-col w-screen h-screen bg-bg-4 flex overflow-hidden">
                    {header}
                    {children}
                    {navigation}
                </div>
            </PlayerAudioProvider>
        </AppProvider>
    )
}
