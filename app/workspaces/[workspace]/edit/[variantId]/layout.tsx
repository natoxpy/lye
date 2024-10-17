// import Navigation from './navigation'
// <Navigation />

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full grow">
            <div className="w-full h-[12px]"></div>
            {children}
        </div>
    )
}
