export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center overflow-hidden relative h-20">
            {children}
        </div>
    )
}
