'use client'
import Navigation from './components/navigation'
import Header from './components/header'
import StateProvider from './[workspace]/edit/state'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <StateProvider>
            <div className="flex-col w-screen h-screen bg-bg-4 flex overflow-hidden">
                <Header />
                {children}
                <Navigation />
            </div>
        </StateProvider>
    )
}
