import React, { useCallback, useEffect, useRef, useState } from 'react'

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

type SectionType = {
    header: string
    start: number
    lines: string[]
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

                    <span />
                    <span className="text-[20px] pointer-events-none select-none text-txt-1">
                        {line}
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

            if (char == HEADER_PREFIX) {
                txtArea.selectionStart = selection - 1
                txtArea.selectionEnd = selection - 1
            }
        })
    }

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
                            const txtArea = textareaRef.current
                            if (!txtArea) return

                            setTimeout(() => {
                                if (
                                    txtArea.selectionStart !=
                                    txtArea.selectionEnd
                                )
                                    return
                                const selection = txtArea.selectionStart

                                const char = txtArea.value[selection - 1]

                                if (char == HEADER_PREFIX) {
                                    if (
                                        e.key == 'ArrowLeft' &&
                                        selection - 1 >= 0
                                    ) {
                                        txtArea.selectionStart = selection - 1
                                        txtArea.selectionEnd = selection - 1
                                    } else if (
                                        e.key == 'ArrowRight' &&
                                        selection + 1 < txtArea.value.length - 1
                                    ) {
                                        txtArea.selectionStart = selection + 1
                                        txtArea.selectionEnd = selection + 1
                                    } else {
                                        txtArea.selectionStart = selection - 1
                                        txtArea.selectionEnd = selection - 1
                                    }
                                }
                            })
                        }}
                        onBlur={() => setTextareaFocus(false)}
                        onFocus={() => setTextareaFocus(true)}
                        onChange={(e) => {
                            setContent(e.target.value.split('\n'))
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
function fmtLines(lines: string[]): [SectionType[], SidelogType[]] {
    const sections: SectionType[] = []
    const logs: SidelogType[] = []
    const unsanitizedSections: SectionType[] = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (isHeaderLine(line)) {
            unsanitizedSections.push({ header: line, start: i, lines: [] })
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
        }

        if (usection.lines.length == 0) {
            addLog(usection.start, 1, 'error', 'Section Cannot Be Empty')
        }

        let emptyStart = -1

        for (let i = 0; i < usection.lines.length; i++) {
            const line = usection.lines[i]

            if (line.trim().length == 0 && emptyStart == -1) {
                emptyStart = usection.start + i + 1
            }

            if (line.trim().length > 0 && emptyStart != -1) {
                addLog(
                    usection.start,
                    usection.start + i + 1 - emptyStart,
                    'warning',
                    'Lines Cannot Be Empty'
                )

                emptyStart = -1
            }
        }

        if (emptyStart != -1)
            addLog(
                emptyStart,
                usection.start + usection.lines.length + 1 - emptyStart,
                'warning',
                'Lines Cannot Be Empty'
            )
    }

    return [sections, logs]
}

function useSidelogs(lines: string[]): SidelogType[] {
    const [sidelogs, setSidelogs] = useState<SidelogType[]>([])

    useEffect(() => {
        const [sections, sl] = fmtLines(lines)
        setSidelogs(sl)

        console.log(sections)
    }, [lines])

    return sidelogs
}

export default function Editor({
    lines,
    setLines,
}: {
    lines: string[]
    setLines: React.Dispatch<React.SetStateAction<string[] | null>>
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

    const sidelogs = useSidelogs(lines)

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
                        className="grow-0 whitespace-nowrap flex items-center select-none text-[24px] min-h-[60px]"
                    >
                        <pre>{c}</pre>
                    </span>

                    {isHeaderLine(c) ? (
                        <>
                            <div className="min-w-6 h-[3px] bg-bg-5 opacity-35"></div>
                            <span className="text-txt-3 opacity-50 select-none transition-all pointer-events-auto cursor-pointer hover:opacity-100">
                                00:00
                            </span>
                            <div className="min-w-2 h-[3px] bg-bg-5 rounded-full"></div>
                            <span className="text-txt-3 opacity-50 select-none transition-all pointer-events-auto cursor-pointer hover:opacity-100">
                                00:00
                            </span>
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
