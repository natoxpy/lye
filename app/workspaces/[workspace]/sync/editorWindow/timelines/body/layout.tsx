import { ReactNode } from 'react'

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
