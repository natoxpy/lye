export default function Layout({
    options,
    tickbar,
    body,
}: {
    options: React.ReactNode
    tickbar: React.ReactNode
    body: React.ReactNode
}) {
    return (
        <div className="h-full bg-bg-4">
            {options}
            {tickbar}
            {body}
        </div>
    )
}
