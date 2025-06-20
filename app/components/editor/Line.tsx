import {
    ChangeEvent,
    ClipboardEvent,
    KeyboardEvent,
    MouseEvent,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import TimeInput from './TimeInput'
import AutoResizeInput from './AutoResizeInput'

export type Line = {
    id: string
    content: string
    header: boolean
    timerange?: { start?: number; end?: number }
}

export default function Line({
    header,
    lineNumber,
    content,
    timerange,
    isPlayingRange,
    isOnSelectionRange,
    onRef,
    onChangeTime,
    onChange,
    onKeyDown,
    onPaste,
    onCustomHover,
    onMouseUp,
    onMouseDown,
}: {
    header: boolean
    lineNumber: number
    content: string
    timerange?: { start?: number; end?: number }
    isPlayingRange: boolean
    isOnSelectionRange: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onChangeTime: (range: { start?: number } | { end?: number }) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    onRef: (ref: HTMLInputElement) => void
    onPaste: (e: ClipboardEvent<HTMLInputElement>) => void
    onCustomHover: () => void
    onMouseUp: (e: MouseEvent<HTMLInputElement>) => void
    onMouseDown: (e: MouseEvent<HTMLInputElement>) => void
}) {
    const onkeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown(e)
    }
    const parentRef = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLInputElement>(null)

    const isNotFullySet = useMemo(() => {
        return timerange?.end == undefined || timerange?.start == undefined
    }, [timerange])

    useEffect(() => {
        const element = ref.current
        if (!element) return

        onRef(element)
    }, [ref, onRef])

    useEffect(() => {
        const element = parentRef.current
        if (element == null) return

        const onMouseMove = (e: globalThis.MouseEvent) => {
            const boundary = element.getBoundingClientRect()
            const x = e.clientX
            const y = e.clientY

            if (
                x > boundary.x &&
                x < boundary.x + boundary.width &&
                y > boundary.y &&
                y < boundary.y + boundary.height
            ) {
                onCustomHover()
            }
        }

        document.addEventListener('mousemove', onMouseMove)

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
        }
    })

    return (
        <div
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            ref={parentRef}
            style={{
                backgroundColor: isOnSelectionRange
                    ? 'var(--color-unaccent-accent-1)'
                    : '',
            }}
            className="w-full h-16 min-h-16 gap-5 flex text-white text-[24px]"
        >
            <div className="flex items-center justify-end min-w-12 h-full">
                <span className="text-txt-3 text-[20px]">
                    {header ? '#' : lineNumber}
                </span>
            </div>
            <div className="w-full flex items-center gap-2">
                {header ? (
                    <>
                        <AutoResizeInput
                            header={header}
                            content={content}
                            onPaste={onPaste}
                            inputRef={ref}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                        />

                        <div className="w-full relative group flex items-center gap-3">
                            <div
                                style={{
                                    backgroundColor: isPlayingRange
                                        ? 'var(--color-accent-blue)'
                                        : '',
                                }}
                                className="min-w-8 h-1 bg-bg-4 rounded transition-colors"
                            ></div>
                            <TimeInput
                                time={timerange?.start}
                                onKeyDown={onKeyDown}
                                onChange={(t) => {
                                    if (t !== timerange?.start)
                                        onChangeTime({ start: t })
                                }}
                            />

                            <div
                                style={{
                                    backgroundColor: isNotFullySet
                                        ? 'hsla(var(--color-accent-red-hsl),0.4)'
                                        : isPlayingRange
                                          ? 'var(--color-accent-blue)'
                                          : '',
                                }}
                                className="relative min-w-4 h-1 bg-bg-4 rounded transition-colors"
                            >
                                <div
                                    style={{
                                        display: isNotFullySet ? '' : 'none',
                                    }}
                                    className="group-hover:flex hidden w-36 absolute left-1/2 -translate-x-1/2 top-6 bg-unaccent-accent-2 rounded px-4 py-3"
                                >
                                    <span className="w-full  text-[16px]">
                                        You should set the{' '}
                                        <span className="text-accent-blue">
                                            time range
                                        </span>{' '}
                                        for this section
                                    </span>
                                </div>
                            </div>

                            <TimeInput
                                time={timerange?.end}
                                onKeyDown={onKeyDown}
                                onChange={(t) => {
                                    if (t !== timerange?.end)
                                        onChangeTime({ end: t })
                                }}
                            />

                            <div
                                style={{
                                    backgroundColor: isPlayingRange
                                        ? 'var(--color-accent-blue)'
                                        : '',
                                }}
                                className="w-full h-1 bg-bg-4 rounded transition-colors"
                            ></div>
                        </div>
                    </>
                ) : (
                    <input
                        onPaste={onPaste}
                        ref={ref}
                        value={content}
                        onChange={(e) => onChange(e)}
                        onKeyDown={(e) => onkeydown(e)}
                        style={{
                            color: header
                                ? 'var(--color-txt-3)'
                                : 'var(--color-txt-2)',
                        }}
                        className="flex w-full items-center h-full bg-transparent border-none outline-none selection:bg-unaccent-accent-1"
                    />
                )}
            </div>
        </div>
    )
}
