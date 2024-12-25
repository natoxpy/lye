export default function Layout({
    options,
    children,
}: {
    options: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="h-full bg-bg-4">
            {options}
            {children}
        </div>
    )
}
