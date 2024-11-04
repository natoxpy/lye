function Layout({ controls }: { controls: React.ReactNode }) {
    return <div className="flex">{controls}</div>
}

function Controls() {
    return <div></div>
}

export default function Component() {
    return (
        <div className="w-full min-h-[32px] bg-bg-5 border-b-2 border-bg-2">
            <Layout controls={<Controls />} />
        </div>
    )
}
