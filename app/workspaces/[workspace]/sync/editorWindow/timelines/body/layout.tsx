import { ReactNode } from 'react'
import TimelinesComponent from '../components/timelines/component'
import TickBarComponent from '../components/tickbar/component'
import TimelineCursorComponent from '../components/timeCursor/component'

export function Layout({
    timelineCursor,
    tickbar,
    board,
}: {
    tickbar: ReactNode
    board: ReactNode
    timelineCursor: ReactNode
}) {
    return (
        <div className="relative flex flex-col w-[calc(100%-96px)]">
            {timelineCursor}
            {tickbar}
            {board}
        </div>
    )
}

export function TickBar() {
    return <TickBarComponent />
}

export function TimelineCursor() {
    return <TimelineCursorComponent leftOffset={96} />
}

export function Timelines({ children }: { children: ReactNode }) {
    return <TimelinesComponent>{children}</TimelinesComponent>
}
