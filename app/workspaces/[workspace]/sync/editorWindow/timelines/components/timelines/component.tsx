'use client'
import { Milliseconds, Pixels } from '@/app/utils/units'
import { Layout, Board } from './layout'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { useResizeEvent } from '../../events/resize'
import { useBoardManager } from '../../../../states/boardManager'
import { usePlayerState } from '@/app/player/state'

export default function Component({ children }: { children: ReactNode }) {
    const layoutRef = useRef<HTMLDivElement>(null)
    const boardRef = useRef<HTMLDivElement>(null)
    const [onResize] = useResizeEvent()
    const { setOffset, setWidth } = useBoardManager()
    const player = usePlayerState()

    const setBoardWidth = useCallback(
        (ms: Milliseconds, px: Pixels) => {
            setWidth(ms, px)
        },
        [setWidth]
    )

    const dispatchBoardOffset = useCallback(() => {
        const layout = layoutRef.current
        const board = boardRef.current
        if (!layout || !board) return
        const boardWidth = board.getBoundingClientRect().width

        const boardOffsetToTime = () =>
            Math.floor(
                (layout.scrollLeft / boardWidth) * player.duration
            ) as Milliseconds

        setOffset(boardOffsetToTime(), layout.scrollLeft as Pixels)
    }, [setOffset, player.duration])

    const dispatchBoardWidth = useCallback(() => {
        const layout = layoutRef.current
        const board = boardRef.current
        if (!layout || !board) return
        const layoutWidth = layout.getBoundingClientRect().width as Pixels
        const boardWidth = board.getBoundingClientRect().width

        const boardWidthToTime = () =>
            ((layoutWidth / boardWidth) * player.duration) as Milliseconds

        setBoardWidth(boardWidthToTime(), layoutWidth)
    }, [setBoardWidth, player.duration])

    useEffect(() => {
        dispatchBoardWidth()
    }, [dispatchBoardWidth])

    onResize(() => {
        dispatchBoardOffset()
    })

    useEffect(() => {
        const layout = layoutRef.current
        if (!layout) return

        layout.addEventListener('scroll', dispatchBoardOffset)
        return () => layout.removeEventListener('scroll', dispatchBoardOffset)
    })

    return (
        <Layout ref={layoutRef}>
            <Board ref={boardRef} width={4000 as Pixels}>
                {children}
            </Board>
        </Layout>
    )
}

// export default function Timelines({ children }: { children: React.ReactNode }) {
//     const elementRef = useRef<HTMLDivElement>(null)
//     const childElementRef = useRef<HTMLDivElement>(null)
//     const { setTimeOffset, setTimeWidth, setCanvasWidthPx, setScrollWidthPx } =
//         useLocalTimelineState()
//     const { duration } = usePlayerState()
//
//     useEffect(() => {
//         const element = elementRef.current
//         const childElement = childElementRef.current
//         if (element === null || childElement == null) return
//
//         setScrollWidthPx(childElement.getBoundingClientRect().width)
//
//         const scroll = () => {
//             const left = element.scrollLeft
//             const childWidth = childElement.getBoundingClientRect().width
//             const width = element.getBoundingClientRect().width
//
//             setCanvasWidthPx(width)
//
//             const leftPct = left / childWidth
//             const widthPct = width / childWidth
//
//             setTimeOffset(Math.floor(duration * leftPct))
//             setTimeWidth(Math.floor(duration * widthPct))
//         }
//         const resize = () => scroll()
//
//         element.addEventListener('scroll', scroll)
//         window.addEventListener('resize', resize)
//         scroll()
//
//         return () => {
//             element.removeEventListener('scroll', scroll)
//             window.removeEventListener('resize', resize)
//         }
//     })
//
//     return (
//         <div
//             ref={elementRef}
//             className="grow min-w-full h-full no-scrollbar overflow-auto overscroll-none border-t-[1px] border-bg-2"
//         >
//             <Handler />
//             <div
//                 ref={childElementRef}
//                 className="relative flex flex-col py-[10px] bg-bg-4 w-[4000px] h-full"
//             >
//                 {children}
//             </div>
//         </div>
//     )
// }
