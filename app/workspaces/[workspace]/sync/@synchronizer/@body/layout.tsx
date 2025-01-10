export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-hidden py-4 relative h-[100px] bg-blue-800">
            {children}
        </div>
    )
}
