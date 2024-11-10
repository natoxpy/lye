import TimelineState from './timeline'

export default function State({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TimelineState>{children}</TimelineState>
        </>
    )
}
