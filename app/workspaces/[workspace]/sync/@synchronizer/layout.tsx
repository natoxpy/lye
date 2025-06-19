'use client'
import { useAudio } from '@/app/components/audio'
import { useSynchronizer } from '@/states/hooks'
import {
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { LayoutContextProvider } from './context'
import { useKeys } from '@/app/components/keyboardProvider'

function TimelineTimebar({
    parentRef,
}: {
    parentRef: RefObject<HTMLDivElement>
}) {
    const thisElement = useRef<HTMLDivElement>(null)
    const { offset, duration, maxwidth } = useSynchronizer((state) => state)
    const [mouseDown, setMouseDown] = useState(false)
    const audio = useAudio()

    const position = useMemo(
        () => ((audio.currentTime * 1000) / duration) * maxwidth,
        [audio.currentTime, duration, maxwidth]
    )

    const offsetPx = useMemo(
        () => (offset / duration) * maxwidth,
        [offset, duration, maxwidth]
    )

    useEffect(() => {
        const parent = parentRef.current
        const element = thisElement.current
        if (parent == undefined || element == undefined) return

        const onMouseMove = (e: MouseEvent) => {
            if (!mouseDown) return

            let x = e.clientX - parent.getBoundingClientRect().x

            x += offsetPx

            const xms = (x / maxwidth) * duration

            audio.currentTime = xms / 1000
        }

        const onMouseDown = () => {
            setMouseDown(true)
        }

        const onMouseUp = () => {
            if (!mouseDown) return
            setMouseDown(false)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        element.addEventListener('mousedown', onMouseDown)

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            element.removeEventListener('mousedown', onMouseDown)
        }
    }, [parentRef, mouseDown, audio, duration, maxwidth, offsetPx])

    return (
        <>
            <div
                ref={thisElement}
                style={{
                    left: position - offsetPx + 'px',
                }}
                className="flex flex-col cursor-pointer items-center w-3 absolute group h-full z-30"
            >
                <svg
                    width="10"
                    height="120"
                    viewBox="0 0 10 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-accent-1 fill-accent-1"
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
            </div>
        </>
    )
}

export function ZoomScrollControl({ children }: { children: React.ReactNode }) {
    const { frame, maxwidth, duration, offset, setOffset, setMaxwidth } =
        useSynchronizer((state) => state)
    const [zoomPoint, setZoomPoint] = useState(0)
    const elementRef = useRef<HTMLDivElement>(null)
    const keys = useKeys()

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const mouseMove = (e: MouseEvent) => {
            const leftX = element.getBoundingClientRect().left
            const zp = e.clientX - leftX

            if (zp > frame) {
                setZoomPoint(frame)
            } else if (zp < 0) {
                setZoomPoint(0)
            } else {
                setZoomPoint(zp)
            }
        }

        document.addEventListener('mousemove', mouseMove)

        return () => {
            document.removeEventListener('mousemove', mouseMove)
        }
    }, [elementRef, frame])

    const process = useCallback(
        (newMaxWidth: number) => {
            // const newMaxWidth = Number(e.currentTarget.value)

            const opx = (offset / duration) * maxwidth

            // changing this changes the point where the zoom focuses
            // frame / 2 means the middle of the frame view
            const optic = zoomPoint

            const u1 = (opx + optic) / maxwidth
            const opx1 = u1 * newMaxWidth - optic
            const o = (opx1 / newMaxWidth) * duration

            setOffset(o)
            setMaxwidth(newMaxWidth)
        },
        [zoomPoint, duration, maxwidth, offset, setMaxwidth, setOffset]
    )

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const onWheel = (e: WheelEvent) => {
            const delta = e.deltaX == 0 ? e.deltaY : e.deltaX
            if (!keys.shift) return
            const min = frame * 2
            const max = ((frame / 3) * duration) / 1000

            console.log()

            let nmw = maxwidth - delta * (maxwidth / frame)

            if (nmw > max) nmw = max
            else if (nmw < min) nmw = min

            process(nmw)
        }

        element.addEventListener('wheel', onWheel)

        return () => {
            element.removeEventListener('wheel', onWheel)
        }
    }, [zoomPoint, duration, frame, maxwidth, keys, process])

    return (
        <>
            <div ref={elementRef}>{children}</div>
        </>
    )
}

export default function Layout({
    options,
    tickbar,
    body,
}: {
    options: React.ReactNode
    tickbar: React.ReactNode
    body: React.ReactNode
}) {
    const { changeOffset, frame, maxwidth, duration } = useSynchronizer(
        (state) => state
    )
    const container = useRef<HTMLDivElement>(null)
    const keys = useKeys()

    useEffect(() => {
        if (!container.current) return
        const el = container.current

        const onWheel = (e: WheelEvent) => {
            if (keys.shift) return

            const delta = e.deltaX == 0 ? e.deltaY : e.deltaX
            const frameDuration = (frame / maxwidth) * duration
            changeOffset(delta * (frameDuration / duration) * 50 * -1)
        }

        el.addEventListener('wheel', onWheel, { passive: false })

        return () => {
            el.removeEventListener('wheel', onWheel)
        }
    }, [container, changeOffset, frame, duration, maxwidth, keys])

    return (
        <div className="flex flex-col h-full gap-2 z-30">
            <div className="bg-bg-3 z-30 border-2 border-unaccent-accent-1 rounded-md overflow-hidden">
                {options}
            </div>

            <div
                className="bg-bg-3 relative z-30 px-1 border-2 border-unaccent-accent-1 rounded-md overflow-hidden h-fit"
                ref={container}
            >
                <ZoomScrollControl>
                    <LayoutContextProvider container={container}>
                        <TimelineTimebar parentRef={container} />
                        {tickbar}
                        {body}
                    </LayoutContextProvider>
                </ZoomScrollControl>
            </div>
        </div>
    )
}
