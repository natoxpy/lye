export default async function layout({
    children,
    sidebar,
}: {
    children: React.ReactNode
    sidebar: React.ReactNode
}) {
    return (
        <div className="flex grow min-w-screen overflow-hidden">
            {sidebar}
            {children}
        </div>
    )
}
