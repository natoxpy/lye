import {
    ChangeEvent,
    ClipboardEvent,
    KeyboardEvent,
    useEffect,
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
    onRef,
    onChangeTime,
    onChange,
    onKeyDown,
    onPaste,
}: {
    header: boolean
    lineNumber: number
    content: string
    timerange?: { start?: number; end?: number }
    isPlayingRange: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onChangeTime: (range: { start?: number } | { end?: number }) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    onRef: (ref: HTMLInputElement) => void
    onPaste: (e: ClipboardEvent<HTMLInputElement>) => void
}) {
    const onkeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown(e)
    }
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        onRef(element)
    }, [ref, onRef])

    return (
        <div className="w-full h-16 min-h-16 gap-5 flex text-white text-[24px]">
            <div className="flex items-center justify-end min-w-12 h-full text-txt-3">
                {header ? '#' : lineNumber}
            </div>
            <div className="w-full flex items-center gap-2">
                {header ? (
                    <>
                        <AutoResizeInput
                            header={header}
                            content={content}
                            inputRef={ref}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                        />

                        <div className="w-full flex items-center gap-3">
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
                                    backgroundColor: isPlayingRange
                                        ? 'var(--color-accent-blue)'
                                        : '',
                                }}
                                className="min-w-4 h-1 bg-bg-4 rounded transition-colors"
                            ></div>

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
                        className="flex w-full items-center h-full bg-transparent border-none outline-none"
                    />
                )}
            </div>
        </div>
    )
}
