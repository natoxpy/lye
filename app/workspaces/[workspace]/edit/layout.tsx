import Navigation from './navigation/component'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-screen grow overflow-hidden">
            <Navigation />
            {children}
        </div>
    )
}
