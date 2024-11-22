import PlayPause from './playpause'

function Layout({ controls }: { controls: React.ReactNode }) {
    return <div className="flex h-full">{controls}</div>
}

function Controls() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div>
                <PlayPause />
            </div>
        </div>
    )
}

export default function Component() {
    return (
        <div className="w-full min-h-[32px] bg-bg-5 border-b-2 border-bg-3">
            <Layout controls={<Controls />} />
        </div>
    )
}
