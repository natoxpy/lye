'use client'
import Navigation from './components/navigation'
import Header from './components/header'
// import StateProvider from './[workspace]/edit/state/provider'
import AppProvider from '@/store/provider'
import PlayerAudioProvider from '../player/component'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <PlayerAudioProvider>
                <div className="flex-col w-screen h-screen bg-bg-4 flex overflow-hidden">
                    <Header />
                    {children}
                    <Navigation />
                </div>
            </PlayerAudioProvider>
        </AppProvider>
    )
}
