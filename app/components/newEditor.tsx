import {
    ChangeEvent,
    KeyboardEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react'
import { hash } from '@/utils/hash'
import { LyricsSection, Line as StoreLine } from '@/states/store-lyrics'

function TimeInput({
    time,
    onChange,
}: {
    time?: number
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    onChange: (t: number | undefined) => void
}) {
    const leadingZero = (t: number) => {
        if (Number.isNaN(t)) return ''
        return t >= 10 ? String(t) : '0' + t
    }
    const [minutes, setMinutes] = useState(
        leadingZero(Math.floor((time ?? NaN) / 60000) % 99)
    )
    const [seconds, setSeconds] = useState(
        leadingZero(Math.floor((time ?? NaN) / 1000) % 60)
    )
    // const [decis, setDecis] = useState(
    //     leadingZero(Math.floor(((time ?? NaN) % 1000) / 10) % 99)
    // )

    const minuteRef = useRef<HTMLInputElement>(null)
    const secondRef = useRef<HTMLInputElement>(null)
    // const deciRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (
            !(
                (minutes.length >= 2 && seconds.length >= 2)
                //&& decis.length >= 2
            )
        )
            return onChange(undefined)

        const m = Number(minutes)
        const s = Number(seconds)
        // const d = Number(decis)

        const mMs = m * 60 * 1000
        const sMs = s * 1000
        // const dMs = d * 10

        onChange(
            mMs + sMs
            // + dMs
        )
    }, [
        minutes,
        seconds,
        // decis,
        onChange,
    ])

    const onkeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (/[0-9]/.test(e.key) && e.currentTarget.value.length >= 2) {
            e.currentTarget.value = ''
        }
    }

    const onInput = (e: FormEvent<HTMLInputElement>) => {
        const element = e.currentTarget
        element.value = element.value.replace(/[^0-9]/g, '')
    }

    return (
        <div className="flex h-full items-center text-[20px] text-txt-3">
            <input
                ref={minuteRef}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                onKeyDown={(e) => {
                    onkeydown(e)
                }}
                placeholder="00"
                className="flex w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-txt-3 placeholder:opacity-35"
                onInput={(e) => {
                    onInput(e)

                    if (e.currentTarget.value.length >= 2) {
                        secondRef.current?.focus()
                    }
                }}
            />
            <span className="text-txt-3 opacity-35">:</span>
            <input
                ref={secondRef}
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="00"
                className="flex w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-txt-3 placeholder:opacity-35"
                onKeyDown={(e) => {
                    if (
                        e.key == 'Backspace' &&
                        e.currentTarget.value.length == 0
                    ) {
                        minuteRef.current?.focus()
                    }

                    onkeydown(e)
                }}
                onInput={(e) => {
                    onInput(e)

                    if (e.currentTarget.value.length >= 2) {
                        // deciRef.current?.focus()

                        if (Number(e.currentTarget.value) > 60) {
                            e.currentTarget.value = '59'
                        }
                    }
                }}
            />
            {/*}
            <span className="text-txt-3 opacity-35">.</span>
            <input
                ref={deciRef}
                value={decis}
                onChange={(e) => setDecis(e.target.value)}
                placeholder="00"
                className="flex w-7 h-7 text-center items-center outline-none border-none bg-transparent rounded placeholder:text-txt-3 placeholder:opacity-35"
                onKeyDown={(e) => {
                    if (
                        e.key == 'Backspace' &&
                        e.currentTarget.value.length == 0
                    ) {
                        secondRef.current?.focus()
                    }

                    onkeydown(e)
                }}
                onInput={onInput}
            />
            {*/}
        </div>
    )
}

function AutoResizeInput({
    header,
    content,
    onChange,
    onKeyDown,
    onRef,
}: {
    header: boolean
    content: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    onRef: (ref: HTMLInputElement) => void
}) {
    const ref = useRef<HTMLInputElement>(null)

    const computeWidth = (value: string, font: string): number => {
        const span = document.createElement('span')
        span.textContent = value

        // Apply styles to avoid affecting layout and match input font
        span.style.visibility = 'hidden'
        span.style.position = 'absolute'
        span.style.whiteSpace = 'pre' // ensures spaces are measured
        span.style.font = font // match font to input

        document.body.appendChild(span)
        const width = span.getBoundingClientRect().width
        document.body.removeChild(span)

        return width
    }

    useEffect(() => {
        if (ref.current != undefined) {
            onRef(ref.current)

            const width = computeWidth(
                ref.current.value,
                getComputedStyle(ref.current).font
            )
            ref.current.style.width = Math.max(width, 12) + 'px'
        }
    }, [ref, onRef])

    return (
        <input
            ref={ref}
            value={content}
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onKeyDown(e)}
            style={{
                color: header ? 'var(--color-txt-3)' : 'var(--color-txt-2)',
            }}
            className="flex w-auto items-center h-full bg-transparent border-none outline-none"
            onInput={(e) => {
                const width = computeWidth(
                    e.currentTarget.value,
                    getComputedStyle(e.currentTarget).font
                )

                e.currentTarget.style.width = Math.max(width, 12) + 'px'
            }}
        />
    )
}

function Line({
    header,
    lineNumber,
    content,
    timerange,
    isPlayingRange,
    onChangeTime,
    onChange,
    onKeyDown,
    onRef,
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
}) {
    const ref = useRef<HTMLInputElement>(null)

    const onkeydown = (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown(e)
    }

    useEffect(() => {
        if (ref.current != null) onRef(ref.current)
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
                            onRef={onRef}
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

function LinesSet({
    lines,
    setLines,
    playerCurrentTime,
}: {
    lines: Line[]
    setLines: React.Dispatch<React.SetStateAction<Line[]>>
    playerCurrentTime: number
}) {
    const [renderLines, setRenderLines] = useState<Array<JSX.Element>>([])
    const [focused, setFocused] = useState<number | null>(null)
    const [selectionStartMemory, setSelectionStartMemory] = useState<
        number | null
    >(null)

    const add = useCallback(
        (value: string, location: number) => {
            const startSlice = lines.slice(0, location)
            const item = {
                id: hash(String(Math.random())),
                content: value,
                header: false,
            }

            const endSlice = lines.slice(location)

            setFocused(location)

            setLines([...startSlice, item, ...endSlice])
        },
        [setLines, lines]
    )

    const setHeader = useCallback(
        (header: boolean, index: number) => {
            setLines((ln) => {
                ln[index].header = header
                return [...ln]
            })
        },
        [setLines]
    )

    const update = useCallback(
        (value: string, index: number) => {
            setLines((ln) => {
                ln[index].content = value
                return [...ln]
            })
        },
        [setLines]
    )

    const remove = useCallback(
        (index: number) => {
            if (index == 0) return
            const startSlice = lines.slice(0, index)
            const endSlice = lines.slice(index + 1)

            setFocused(index - 1)

            setLines([...startSlice, ...endSlice])
        },
        [setLines, lines]
    )

    const updateTimeRange = useCallback(
        (timerange: { start?: number } | { end?: number }, index: number) => {
            setLines((ln) => {
                const nln = structuredClone(ln)

                if (!nln[index].timerange)
                    nln[index].timerange = { start: 0, end: 0 }

                if ('start' in timerange)
                    nln[index].timerange.start = timerange.start

                if ('end' in timerange) nln[index].timerange.end = timerange.end

                return nln
            })
        },
        [setLines]
    )

    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>, line: Line, i: number) => {
            switch (e.key) {
                case 'ArrowLeft': {
                    const element = e.currentTarget
                    const selectionStart = element.selectionStart
                    const selectionEnd = element.selectionEnd

                    if (selectionStart == selectionEnd && selectionStart == 0)
                        setFocused(i - 1)

                    break
                }

                case 'ArrowRight': {
                    const element = e.currentTarget
                    const selectionStart = element.selectionStart
                    const selectionEnd = element.selectionEnd

                    if (
                        selectionStart == selectionEnd &&
                        selectionStart == e.currentTarget.value.length
                    )
                        setFocused(i + 1)
                    break
                }

                case 'ArrowUp':
                    setFocused(i - 1)
                    break
                case 'ArrowDown':
                    setFocused(i + 1)
                    break
                case 'Enter':
                    add('', i + 1)
                    break
                case '#':
                    if (i == 0) return
                    e.preventDefault()
                    e.stopPropagation()
                    setHeader(!line.header, i)
                    setTimeout(() => {
                        setFocused(i)
                    }, 1)
                    break
                case 'Backspace':
                    const element = e.currentTarget
                    const selectionStart = element.selectionStart
                    const selectionEnd = element.selectionEnd

                    setTimeout(() => {
                        if (
                            selectionStart == element.selectionStart &&
                            selectionStart == 0 &&
                            selectionStart == selectionEnd
                        )
                            remove(i)
                    }, 1)
                    break
            }
        },
        [add, remove, setHeader]
    )

    useEffect(() => {
        setRenderLines([])
        let offset = 0

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.header) offset += 1

            const isPlayingRange =
                line.timerange?.start != undefined &&
                line.timerange?.end != undefined &&
                line.timerange.start <= playerCurrentTime * 1000 &&
                line.timerange.end >= playerCurrentTime * 1000

            const lineElement = (
                <Line
                    isPlayingRange={isPlayingRange}
                    onChangeTime={(v) => {
                        updateTimeRange(v, i)
                    }}
                    timerange={line.timerange}
                    onKeyDown={(e) => onKeyDown(e, line, i)}
                    onRef={(ref) => {
                        if (i == focused) {
                            ref.focus()
                            setFocused(null)
                        }

                        if (selectionStartMemory != null) {
                            ref.selectionStart = selectionStartMemory
                            ref.selectionEnd = selectionStartMemory
                            setSelectionStartMemory(null)
                        }
                    }}
                    onChange={(m) => {
                        update(m.target.value, i)
                        setSelectionStartMemory(m.target.selectionStart)
                    }}
                    header={line.header}
                    key={i}
                    lineNumber={i + 1 - offset}
                    content={line.content}
                />
            )

            setRenderLines((rln) => {
                return [...rln, lineElement]
            })
        }
    }, [
        lines,
        focused,
        selectionStartMemory,
        onKeyDown,
        update,
        updateTimeRange,
        playerCurrentTime,
    ])

    return <>{renderLines}</>
}

type Line = {
    id: string
    content: string
    header: boolean
    timerange?: { start?: number; end?: number }
}

function linetoStoreLine(line: Line): StoreLine {
    return { content: line.content, timerange: line.timerange, id: line.id }
}

function storeLineToLine(line: StoreLine, header: boolean): Line {
    return {
        content: line.content,
        timerange: line.timerange,
        id: line.id,
        header,
    }
}

export default function Editor({
    lyricsSections,
    playerCurrentTime,
    onChange,
}: {
    lyricsSections: LyricsSection[]
    playerCurrentTime: number
    onChange: (lyrics: LyricsSection[]) => void
}) {
    const [lines, setLines] = useState<Array<Line>>([])

    useEffect(() => {
        const lns: Line[] = []

        for (const section of lyricsSections) {
            lns.push(storeLineToLine(section.header, true))
            lns.push(...section.content.map((l) => storeLineToLine(l, false)))
        }

        setLines(lns)
    }, [lyricsSections])

    useEffect(() => {
        const lyrics: LyricsSection[] = []
        let header: StoreLine | null = null
        let collect: Array<StoreLine> = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.header && header != null) {
                lyrics.push({
                    header,
                    content: collect,
                })
            }

            if (line.header) {
                header = linetoStoreLine(line)
                collect = []
                continue
            }

            collect.push(linetoStoreLine(line))
        }

        if (header != null)
            lyrics.push({
                header,
                content: collect,
            })

        if (lyrics.length == 0) return
        if (lyrics.length == lyricsSections.length) {
            let isSame = true
            for (let i = 0; i < lyrics.length; i++) {
                const l = lyrics[i]
                const ls = lyricsSections[i]
                if (JSON.stringify(l, null) != JSON.stringify(ls, null))
                    isSame = false
            }

            if (isSame) return
        }

        onChange(lyrics)
    }, [lines, onChange, lyricsSections])

    return (
        <div className="flex flex-col w-full h-full pt-3 overflow-y-auto overflow-x-hidden overscroll-none">
            <LinesSet
                playerCurrentTime={playerCurrentTime}
                lines={lines}
                setLines={(v) => setLines(v)}
            />
        </div>
    )
}
