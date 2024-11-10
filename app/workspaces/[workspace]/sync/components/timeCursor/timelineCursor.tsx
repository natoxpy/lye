import { usePlayerDispatch, usePlayerState } from '@/app/player/state'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalTimelineState } from '../../states/timeline'

function IconCursor(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="120"
            viewBox="0 0 10 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_2467_106561)">
                <path d="M1 0.5H5H9V4C9 4 6.5621 5.89259 5 7.44167C3.4379 5.89259 1 4 1 4V0.5Z" />
                <path
                    d="M5 0.5H1V4C1 4 3.4379 5.89259 5 7.44167M5 0.5C5 0.5 5 4.73078 5 7.44167M5 0.5H9V4C9 4 6.5621 5.89259 5 7.44167M5 119.5C5 119.5 5 51.2032 5 7.44167"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    )
}

export default function Component() {
    const rootRef = useRef<HTMLDivElement>(null)
    const { duration, currentTime, paused } = usePlayerState()
    const playerDispatch = usePlayerDispatch()
    const { timeOffset, scrollWidthPx, canvasWidthPx } = useLocalTimelineState()
    const [mouseDown, setMouseDown] = useState(false)
    const [cursorTimeMs, setCursorTimeMS] = useState(0)

    const setPosition = useCallback(
        (time: number) => {
            const root = rootRef.current
            if (root == null) return

            const leftDisplacementRatio = timeOffset / duration
            const currentTimeDpmtRatio = time / duration
            const leftPxDpmt = leftDisplacementRatio * scrollWidthPx * -1
            const currentTimeDpmt = currentTimeDpmtRatio * scrollWidthPx

            const left = leftPxDpmt + currentTimeDpmt

            root.style.left = left - 9 + 'px'
        },
        [duration, scrollWidthPx, timeOffset]
    )

    useEffect(() => {
        if (mouseDown) return
        setPosition(currentTime)
    }, [currentTime, mouseDown, setPosition])

    useEffect(() => {
        const root = rootRef.current
        if (root == null) return

        const mouseMove = (e: MouseEvent) => {
            if (mouseDown == false) return

            const offset = 96
            let relX = e.clientX - offset
            const min = 0
            const max = canvasWidthPx

            if (relX <= min) relX = min
            else if (relX >= max) relX = max

            const leftPxDpmt = (timeOffset / duration) * scrollWidthPx
            const x = leftPxDpmt + relX

            const xms = (x / scrollWidthPx) * duration

            setCursorTimeMS(xms)
            setPosition(xms)

            if (paused) {
                playerDispatch({
                    type: 'sync-currentTime',
                    payload: xms / 1_000,
                })
                playerDispatch({
                    type: 'set-currentTime',
                    payload: xms,
                })
            }
        }

        const mouseUp_m = () => {
            if (!mouseDown) return

            playerDispatch({
                type: 'sync-currentTime',
                payload: cursorTimeMs / 1_000,
            })
            playerDispatch({
                type: 'set-currentTime',
                payload: cursorTimeMs,
            })

            setMouseDown(false)
        }

        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp_m)

        return () => {
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('mouseup', mouseUp_m)
        }
    }, [
        paused,
        cursorTimeMs,
        canvasWidthPx,
        duration,
        mouseDown,
        playerDispatch,
        scrollWidthPx,
        setPosition,
        timeOffset,
    ])

    return (
        <div
            ref={rootRef}
            onMouseDown={() => {
                setMouseDown(true)
            }}
            className="flex justify-center cursor-pointer group absolute left-[800px] z-20 w-[20px] h-[120px]"
        >
            <IconCursor className="transition-all stroke-accent-1 fill-accent-1 group-hover:opacity-100 opacity-40" />
        </div>
    )
}
