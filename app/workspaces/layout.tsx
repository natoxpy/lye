'use client'
import AppProvider from '@/store/provider'
import PlayerAudioProvider from '@/app/components/player/component'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <PlayerAudioProvider>
                <div className="flex-col w-screen max-h-screen h-screen bg-bg-4 flex overflow-hidden">
                    {children}
                </div>
            </PlayerAudioProvider>
        </AppProvider>
    )
}
