export default async function layout({
    children,
    sidebar,
}: {
    children: React.ReactNode
    sidebar: React.ReactNode
}) {
    return (
        <div className="flex w-screen grow overflow-hidden">
            {sidebar}
            {children}
        </div>
    )
}
