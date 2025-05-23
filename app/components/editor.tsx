import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Section } from '../../states/store-sectioned-lyrics'
import { hash } from '@/utils/hash'
import * as binary from '@/utils/binary'

export const HEADER_PREFIX = '\u200B'

const LINE_HEIGHT = 60

const HeaderLineNumberPlaceholder = '#'
const HeaderLineNumberReplacement = '#'

type SidelogType = {
    type: 'error' | 'warning' | 'message'
    start: number
    lines: number
    msg: string
    // 'center' by default
    aligned?: 'top' | 'bottom'
}

function isHeaderLine(v: string) {
    return (
        v.trim().startsWith(HeaderLineNumberReplacement) ||
        v.trim().startsWith(HEADER_PREFIX)
    )
}

const SidelineMarkers = {
    Error: ({
        lines,
        msg,
        alignment,
    }: {
        lines: number
        msg: string
        alignment?: 'top' | 'bottom'
    }) => (
        <div
            style={{
                height: `calc(60px * ${lines})`,
            }}
            className="group/msg-box top-0 absolute min-w-4 max-w-4 z-[9999]"
        >
            <div
                style={{
                    alignItems:
                        alignment == 'top'
                            ? 'flex-end'
                            : alignment == 'bottom'
                              ? 'flex-start'
                              : 'center',
                }}
                className="relative flex h-full w-1 bg-red-400 rounded-r group-hover/msg-box:bg-red-500 group-hover/msg-box:w-2 transition-all group-hover/msg-box:opacity-100 opacity-75"
            >
                <div className="absolute group-hover/msg-box:opacity-100 group-hover/msg-box:scale-100 origin-left transition-all opacity-35 scale-0 w-fit h-fit bg-[hsla(var(--color-bg-5-hsl),0.75)] px-3 py-2 left-4 rounded z-50">
                    <span className="text-txt-2 text-[14px]">{msg}</span>
                </div>
            </div>
        </div>
    ),
    Warning: ({
        lines,
        msg,
        alignment,
    }: {
        lines: number
        msg: string
        alignment?: 'top' | 'bottom'
    }) => (
        <div
            style={{
                height: `calc(60px * ${lines})`,
            }}
            className="group/msg-box top-0 absolute min-w-4 max-w-4 z-20"
        >
            <div
                style={{
                    alignItems:
                        alignment == 'top'
                            ? 'flex-end'
                            : alignment == 'bottom'
                              ? 'flex-start'
                              : 'center',
                }}
                className="flex h-full w-1 bg-yellow-300 rounded-r group-hover/msg-box:bg-yellow-400 group-hover/msg-box:w-2 transition-all group-hover/msg-box:opacity-100 opacity-50"
            >
                <div className="absolute group-hover/msg-box:opacity-100 group-hover/msg-box:scale-100 origin-left transition-all opacity-35 scale-0 w-fit h-fit bg-[hsla(var(--color-bg-5-hsl),0.75)] px-3 py-2 left-4 rounded z-50">
                    <span className="text-txt-2 text-[14px]">{msg}</span>
                </div>
            </div>
        </div>
    ),
    Message: ({
        lines,
        msg,
        alignment,
    }: {
        lines: number
        msg: string
        alignment?: 'top' | 'bottom'
    }) => {
        return (
            <div
                style={{
                    height: `calc(60px * ${lines})`,
                }}
                className="group/msg-box top-0 absolute min-w-4 max-w-4 z-20"
            >
                <div
                    style={{
                        alignItems:
                            alignment == 'top'
                                ? 'flex-end'
                                : alignment == 'bottom'
                                  ? 'flex-start'
                                  : 'center',
                    }}
                    className="flex h-full w-1 bg-accent-blue rounded-r group-hover:/msg-box:w-2 transition-all group-hover/msg-box:opacity-100 opacity-50"
                >
                    <div className="absolute group-hover/msg-box:opacity-100 group-hover/msg-box:scale-100 origin-left transition-all opacity-35 scale-0 w-fit h-fit bg-[hsla(var(--color-bg-5-hsl),0.75)] px-3 py-2 left-4 rounded z-50">
                        <span className="text-txt-2 text-[14px]">{msg}</span>
                    </div>
                </div>
            </div>
        )
    },
}

function LineNumbers({
    lines,
    sidelogs,
}: {
    lines: string[]
    sidelogs: SidelogType[]
}) {
    return (
        <>
            {lines.map((line, key) => (
                <div
                    style={{
                        backgroundColor:
                            key == -1 ? 'rgba(255,255,255,0.5)' : '',
                        height: LINE_HEIGHT + 'px',
                    }}
                    className="relative flex select-none items-center justify-between pr-[25px]"
                    key={key}
                >
                    {sidelogs.map(({ type, msg, start, lines, aligned }) => (
                        <>
                            {type == 'error' && key == start && (
                                <SidelineMarkers.Error
                                    lines={lines}
                                    msg={msg}
                                    alignment={aligned}
                                />
                            )}

                            {type == 'warning' && key == start && (
                                <SidelineMarkers.Warning
                                    lines={lines}
                                    msg={msg}
                                    alignment={aligned}
                                />
                            )}

                            {type == 'message' && key == start && (
                                <SidelineMarkers.Message
                                    lines={lines}
                                    msg={msg}
                                    alignment={aligned}
                                />
                            )}
                        </>
                    ))}

                    <div
                        style={{
                            display:
                                line == HeaderLineNumberPlaceholder
                                    ? 'none' // feature intentially disabled
                                    : 'none',
                        }}
                        className="w-14 h-2/3 absolute right-0 border-y-2 border-l-2 border-txt-3 rounded-l-lg opacity-35"
                    ></div>

                    <span />
                    <span className="text-[20px] pointer-events-none select-none text-txt-1">
                        {line == HeaderLineNumberPlaceholder && <>#</>}
                        {line != HeaderLineNumberPlaceholder && String(line)}
                    </span>
                </div>
            ))}
        </>
    )
}

function Layout({
    numbers,
    lines,
    content,
    setContent,
}: {
    numbers: React.ReactNode
    lines: React.ReactNode
    content: string[]
    setContent: (args: string[]) => void
}) {
    const numbersRef = useRef<HTMLDivElement>(null)
    const linesRef = useRef<HTMLDivElement>(null)
    const linesFitRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [textareaFocus, setTextareaFocus] = useState<boolean>(false)
    const [previosCursor, setPreviousCursor] = useState<number | null>(null)

    const updateSizes = useCallback(() => {
        const numbersRoot = numbersRef.current
        const linesRoot = linesRef.current
        const linesFitRoot = linesFitRef.current
        const textareaRoot = textareaRef.current
        if (!numbersRoot || !linesRoot || !linesFitRoot || !textareaRoot) return

        linesRoot.style.height =
            numbersRoot.getBoundingClientRect().height + 'px'

        textareaRoot.style.minWidth =
            linesFitRoot.getBoundingClientRect().width + 40 + 'px'

        textareaRoot.style.height =
            linesRoot.getBoundingClientRect().height + 'px'
    }, [])

    useEffect(() => {
        const update = () => updateSizes()
        update()

        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [numbersRef, linesRef, updateSizes, content])

    useEffect(() => {
        const element = textareaRef.current
        if (!element) return
        if (previosCursor !== null) {
            setPreviousCursor(null)
            element.selectionStart = previosCursor
            element.selectionEnd = previosCursor
        }
    }, [lines, previosCursor, setPreviousCursor])

    const properPlaceCursor = () => {
        const txtArea = textareaRef.current
        if (!txtArea) return

        setTimeout(() => {
            if (txtArea.selectionStart != txtArea.selectionEnd) return
            const selection = txtArea.selectionStart

            const char = txtArea.value[selection - 1]
            const c = txtArea.value[selection]

            if (char == HEADER_PREFIX) {
                txtArea.selectionStart = selection - 1
                txtArea.selectionEnd = selection - 1
            }

            if ((char == '\n' || char == undefined) && c == HEADER_PREFIX) {
                txtArea.selectionStart = selection + 1
                txtArea.selectionEnd = selection + 1
            }
        })
    }

    // const properPlaceCursorByEvent = (e: KeyboardEvent) => {
    //     const txtArea = textareaRef.current
    //     if (!txtArea) return

    //     setTimeout(() => {
    //         if (txtArea.selectionStart != txtArea.selectionEnd) return
    //         const selection = txtArea.selectionStart

    //         const char = txtArea.value[selection - 1]
    //         const c = txtArea.value[selection]
    //         const postc = txtArea.value[selection + 1]

    //         if (char == '\n' && c == HEADER_PREFIX && postc == '\n') {
    //             txtArea.selectionStart = selection + 1
    //             txtArea.selectionEnd = selection + 1
    //         }

    //         if (char == HEADER_PREFIX && c != '\n') {
    //             if (e.key == 'ArrowLeft' && selection - 1 >= 0) {
    //                 txtArea.selectionStart = selection - 1
    //                 txtArea.selectionEnd = selection - 1
    //             } else if (
    //                 e.key == 'ArrowRight' &&
    //                 selection + 1 < txtArea.value.length - 1
    //             ) {
    //                 txtArea.selectionStart = selection + 1
    //                 txtArea.selectionEnd = selection + 1
    //             } else {
    //                 txtArea.selectionStart = selection - 1
    //                 txtArea.selectionEnd = selection - 1
    //             }
    //         }

    //         if ((char == '\n' || char == undefined) && c == HEADER_PREFIX) {
    //             txtArea.selectionStart = selection + 1
    //             txtArea.selectionEnd = selection + 1
    //         }
    //     })
    // }

    return (
        <div
            className={
                'flex w-full h-full pt-3 overflow-y-auto overflow-x-hidden overscroll-none'
            }
            onClick={() => {
                const element = textareaRef.current
                if (!element) return
                if (!textareaFocus) element.focus()
                properPlaceCursor()
            }}
        >
            <div ref={numbersRef} className="min-w-[85px] h-fit">
                {numbers}
            </div>

            <div className="flex grow h-fit overflow-x-auto overflow-y-hidden overscroll-x-none">
                <div
                    ref={linesRef}
                    className="min-w-fit grow relative flex  pr-10 flex-col"
                >
                    <div ref={linesFitRef} className="pointer-events-none z-10">
                        {lines}
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={content.join('\n')}
                        onKeyDown={(e) => {
                            const txtarea = e.target as HTMLTextAreaElement
                            const s = txtarea.value.split('\n')[0]

                            const currentCursor = {
                                start: txtarea.selectionStart,
                                end: txtarea.selectionEnd,
                            }

                            setTimeout(() => {
                                const toCursor = {
                                    start: txtarea.selectionStart,
                                    end: txtarea.selectionEnd,
                                }

                                const res = binary.testProcess(
                                    txtarea.value,
                                    currentCursor,
                                    toCursor,
                                    txtarea.selectionDirection
                                )

                                if (res != undefined) {
                                    txtarea.selectionStart = res
                                    txtarea.selectionEnd = res
                                }
                            }, 1)
                        }}
                        onBlur={() => setTextareaFocus(false)}
                        onFocus={() => setTextareaFocus(true)}
                        onChange={(e) => {
                            const contentArray = e.target.value
                                .split('\n')
                                .map((l) => l.replace(/HEADER_PREFIX/g, ''))

                            const readMetadata = (line: string) => {
                                const results = binary.extractFromString(line)

                                let headbin = null
                                let tailbin = null

                                for (const result of results) {
                                    if (headbin != null && tailbin != null)
                                        break

                                    if (result.startsWith('h')) {
                                        const data = result
                                            .replace('h:', '')
                                            .split(':')
                                        headbin = {
                                            id: data[0],
                                            line: Number(data[1]),
                                        }
                                    }
                                    if (result.startsWith('t')) {
                                        const data = result
                                            .replace('t:', '')
                                            .split(':')
                                        tailbin = {
                                            contentHash: data[0],
                                            id: data[1],
                                            line: Number(data[2]),
                                        }
                                    }
                                }

                                return {
                                    head: headbin,
                                    tail: tailbin,
                                }
                            }

                            const writeMetadata = (
                                id: string,
                                contentHash: string,
                                line: number
                            ) => {
                                const headbin = binary.encode(`h:${id}:${line}`)
                                const tailbin = binary.encode(
                                    `t:${contentHash}:${id}:${line}`
                                )

                                return [headbin, tailbin]
                            }

                            const encodedContentArray = []

                            for (let i = 0; i < contentArray.length; i++) {
                                const line = contentArray[i]

                                const isLineHeaderLine = isHeaderLine(line)
                                const existingData = readMetadata(line)

                                const decodedLine = binary
                                    .removeEncodings(line)
                                    .replace(HEADER_PREFIX, '')

                                const [head, tail] = writeMetadata(
                                    existingData.head == null
                                        ? hash(String(Math.random()))
                                        : existingData.head.id,
                                    hash(decodedLine),
                                    i
                                )

                                if (isLineHeaderLine) {
                                    encodedContentArray.push(decodedLine + tail)
                                } else {
                                    encodedContentArray.push(decodedLine + tail)
                                }
                            }

                            for (const line of encodedContentArray) {
                                console.log(
                                    JSON.stringify(readMetadata(line), null, 2)
                                )
                            }

                            setContent(encodedContentArray)
                            setPreviousCursor(e.target.selectionEnd)
                        }}
                        style={{
                            lineHeight: LINE_HEIGHT + 'px',
                        }}
                        className={
                            'absolute p-0 opacity-50 text-[24px] text-txt-2 overflow-hidden top-0 left-0 bg-transparent ' +
                            'resize-none shadow-none outline-none main-code-editor'
                        }
                    />
                </div>
            </div>
        </div>
    )
}

/**
 * @rule {Error} Lyrics cannot start with no section header
 * @rule {Error} Sections cannot be empty
 * @rule {Warning} Section header must have a name
 * @rule {Warning} Sections must be given a timerange
 */
function lineLogger(lines: string[]): SidelogType[] {
    const logs: SidelogType[] = []
    const unsanitizedSections: Section[] = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (isHeaderLine(line)) {
            unsanitizedSections.push({
                header: line,
                start: i,
                lines: [],
                timeframe: { start: null, end: null },
            })
        } else {
            if (unsanitizedSections.length - 1 < 0) continue
            unsanitizedSections[unsanitizedSections.length - 1].lines.push(line)
        }
    }

    const addLog = (
        start: number,
        linesn: number,
        type: SidelogType['type'],
        msg: string
    ) => {
        logs.push({
            start,
            lines: linesn,
            type,
            msg,
            aligned:
                start == 0
                    ? 'bottom'
                    : start == lines.length - 1
                      ? 'top'
                      : undefined,
        })
    }

    if (unsanitizedSections.length > 0 && unsanitizedSections[0].start > 0) {
        addLog(
            0,
            unsanitizedSections[0].start,
            'error',
            'Lines Do Not Have a Section Header'
        )
    }

    for (const usection of unsanitizedSections) {
        if (usection.header.trim().length == 1) {
            addLog(usection.start, 1, 'warning', 'Header Must Have a Name')

            continue
        }

        if (usection.lines.length == 0) {
            addLog(usection.start, 1, 'error', 'Section Cannot Be Empty')

            continue
        }

        let emptyStart = -1

        for (let i = 0; i < usection.lines.length; i++) {
            const line = usection.lines[i]

            if (line.trim().length == 0 && emptyStart == -1) {
                emptyStart = usection.start + i + 1
            }

            if (line.trim().length > 0 && emptyStart != -1) {
                addLog(
                    emptyStart,
                    usection.start + i + 1 - emptyStart,
                    'warning',
                    'Lines Cannot Be Empty'
                )

                emptyStart = -1

                continue
            }
        }

        if (emptyStart != -1) {
            addLog(
                emptyStart,
                usection.start + usection.lines.length + 1 - emptyStart,
                'warning',
                'Lines Cannot Be Empty'
            )
            continue
        }
    }

    return logs
}

function useLineLogger(lines: string[]): [SidelogType[]] {
    const [sidelogs, setSidelogs] = useState<SidelogType[]>([])

    useEffect(() => {
        const sl = lineLogger(lines)
        setSidelogs(sl)
    }, [lines])

    return [sidelogs]
}

function SectionTimeInput({
    loadtime,
    setTime,
}: {
    loadtime?: number
    setTime: (timeMs?: number) => void
}) {
    const extractMinutes = (time?: number): [string, number] => {
        if (time == undefined) return ['', 0]
        const t = Math.floor(time / (1000 * 60)) % 99
        return [t < 10 ? '0' + t : String(t), 2]
    }

    const extractSeconds = (time?: number): [string, number] => {
        if (time == undefined) return ['', 0]
        const t = Math.floor(time / 1000) % 60
        return [t < 10 ? '0' + t : String(t), 2]
    }

    const extractDeciSeconds = (time?: number): [string, number] => {
        if (time == undefined) return ['', 0]
        const t = Math.floor((time % 1000) / 100) % 99
        return [t < 10 ? '0' + t : String(t), 2]
    }

    const [minutes, setMinutes] = useState<[string, number]>(
        extractMinutes(loadtime)
    )
    const [seconds, setSeconds] = useState<[string, number]>(
        extractSeconds(loadtime)
    )
    const [deciSeconds, setDeciSeconds] = useState<[string, number]>(
        extractDeciSeconds(loadtime)
    )

    const secondsRef = useRef<HTMLDivElement>(null)
    const deciSecondsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // console.log(loadtime)
    })

    useEffect(() => {
        const m = Number(minutes[0])
        const s = Number(seconds[0])
        const dcs = Number(deciSeconds[0])

        if (minutes[1] != 2 || seconds[1] != 2 || deciSeconds[1] != 2)
            return setTime(undefined)

        const m_ms = m * 60 * 1000
        const s_ms = s * 1000
        const dcs_ms = dcs * 10

        setTime(m_ms + s_ms + dcs_ms)
    }, [minutes, seconds, deciSeconds, setTime])

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="flex text-txt-3 opacity-50 select-none transition-all pointer-events-auto cursor-pointer hover:opacity-100"
        >
            <div
                tabIndex={0}
                className="outline-none flex justify-center w-[21px] focus:bg-bg-6"
                onKeyDown={(e) => {
                    if (e.key == 'Backspace')
                        setMinutes((dcs) => {
                            if (dcs[1] == 2) return [dcs[0][0], 1]
                            return ['', 0]
                        })
                    if (e.key == 'Delete') setMinutes(['', 0])

                    const deciSec = Number(e.key)
                    if (Number.isNaN(deciSec)) return

                    setMinutes((m) => {
                        if (m[1] == 0 || m[1] == 2) {
                            return [String(deciSec), 1]
                        } else if (m[1] == 1) {
                            secondsRef.current?.focus()
                            return [m[0] + String(deciSec), 2]
                        }

                        return ['', 0]
                    })
                }}
            >
                <span>
                    {minutes[1] == 1
                        ? minutes[0].length == 2
                            ? minutes[0]
                            : minutes[0] + '-'
                        : minutes[1] == 2
                          ? minutes[0]
                          : '--'}
                </span>
            </div>
            :
            <div
                ref={secondsRef}
                tabIndex={0}
                className="outline-none flex justify-center w-[21px] focus:bg-bg-6"
                onKeyDown={(e) => {
                    if (e.key == 'Backspace')
                        setSeconds((s) => {
                            if (s[1] == 2) return [s[0][0], 1]
                            return ['', 0]
                        })
                    if (e.key == 'Delete') setSeconds(['', 0])

                    const sec = Number(e.key)
                    if (Number.isNaN(sec)) return

                    setSeconds((s) => {
                        if (s[1] == 0 || s[1] == 2) {
                            return [String(sec), 1]
                        } else if (s[1] == 1) {
                            let total = s[0] + String(sec)
                            const numt = Number(total)
                            if (numt >= 60) total = '59'

                            deciSecondsRef.current?.focus()

                            return [total, 2]
                        }

                        return ['', 0]
                    })
                }}
            >
                <span>
                    {seconds[1] == 1
                        ? seconds[0].length == 2
                            ? seconds[0]
                            : seconds[0] + '-'
                        : seconds[1] == 2
                          ? seconds[0]
                          : '--'}
                </span>
            </div>
            .
            <div
                ref={deciSecondsRef}
                tabIndex={0}
                className="outline-none flex justify-center w-[21px] focus:bg-bg-6"
                onKeyDown={(e) => {
                    if (e.key == 'Backspace')
                        setDeciSeconds((dcs) => {
                            if (dcs[1] == 2) return [dcs[0][0], 1]
                            return ['', 0]
                        })
                    if (e.key == 'Delete') setDeciSeconds(['', 0])

                    const deciSec = Number(e.key)
                    if (Number.isNaN(deciSec)) return

                    setDeciSeconds((dcs) => {
                        if (dcs[1] == 0 || dcs[1] == 2) {
                            return [String(deciSec), 1]
                        } else if (dcs[1] == 1) {
                            return [dcs[0] + String(deciSec), 2]
                        }

                        return ['', 0]
                    })
                }}
            >
                <span>
                    {deciSeconds[1] == 1
                        ? deciSeconds[0].length == 2
                            ? deciSeconds[0]
                            : deciSeconds[0] + '-'
                        : deciSeconds[1] == 2
                          ? deciSeconds[0]
                          : '--'}
                </span>
            </div>
        </div>
    )
}

export default function Editor({
    lines,
    sections,
    setLines,
    setTimeRangeStart,
    setTimeRangeEnd,
}: {
    lines: string[]
    sections: Section[]
    setLines: React.Dispatch<React.SetStateAction<string[] | null>>
    setTimeRangeStart: (time: number, start: number) => void
    setTimeRangeEnd: (time: number, start: number) => void
}) {
    function getLineNumbers() {
        const numbers = []
        let i = 0

        for (const line of lines) {
            if (isHeaderLine(line)) {
                numbers.push(HeaderLineNumberPlaceholder)
                continue
            }

            i += 1
            numbers.push(`${i}`)
        }

        return numbers
    }

    const [sidelogs] = useLineLogger(lines)

    return (
        <Layout
            content={lines}
            setContent={(v) => {
                setLines(
                    v.map((c) => {
                        if (c.startsWith(HeaderLineNumberReplacement))
                            return c.replace(
                                HeaderLineNumberReplacement,
                                HEADER_PREFIX
                            )
                        return c
                    })
                )
            }}
            numbers={
                <LineNumbers lines={getLineNumbers()} sidelogs={sidelogs} />
            }
            lines={lines.map((c, key) => (
                <div
                    key={key}
                    className="flex items-center gap-3 hover/headerline"
                >
                    <span
                        style={{
                            color: isHeaderLine(c)
                                ? 'var(--color-txt-3)'
                                : 'var(--color-txt-2)',
                        }}
                        className="grow-0 whitespace-nowrap flex items-center select-none text-[24px] min-h-[60px] relative"
                    >
                        <pre>{c}</pre>
                        <div
                            style={{
                                // feature intentially disabled
                                display: isHeaderLine(c) ? 'none' : 'none',
                            }}
                            className="w-[calc(100%+1rem)] h-2/3 absolute left-0 border-y-2 border-r-2 border-txt-3 rounded-r-lg opacity-35"
                        ></div>
                    </span>

                    {isHeaderLine(c) ? (
                        <>
                            <div className="min-w-6 h-[3px] bg-bg-5 opacity-35"></div>
                            <SectionTimeInput
                                loadtime={
                                    sections.find((sec) => sec.start == key)
                                        ?.timeframe?.start ?? undefined
                                }
                                setTime={(time) => {
                                    if (time == undefined) return

                                    setTimeRangeStart(time, key)
                                }}
                            />
                            <div className="min-w-2 h-[3px] bg-bg-5 rounded-full"></div>
                            <SectionTimeInput
                                loadtime={
                                    sections.find((sec) => sec.start == key)
                                        ?.timeframe?.end ?? undefined
                                }
                                setTime={(time) => {
                                    if (time == undefined) return

                                    setTimeRangeEnd(time, key)
                                }}
                            />
                            <div className="w-full h-[3px] bg-bg-4 opacity-35"></div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        />
    )
}
