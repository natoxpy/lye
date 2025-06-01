import { useCallback, useState, useEffect, KeyboardEvent } from 'react'
import type { Line } from './Line'
import LineComponent from './Line'
import { hash } from '@/utils/hash'

/*
 * Can parse `genius`
 */
function parseHeader(content: string): [string, boolean] {
    if (content.startsWith('[') && content.endsWith(']')) {
        return [content.replace(/[\[\]]/g, ''), true]
    }

    return [content, false]
}

export default function Editor({
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

    const addMultiple = useCallback(
        (value: string[], location: number) => {
            const startSlice = lines.slice(0, location)
            const item = value.map((v) => {
                const [content, header] = parseHeader(v)

                return {
                    id: hash(String(Math.random())),
                    content,
                    header,
                }
            })

            const endSlice = lines.slice(location)

            setFocused(location)

            setLines([...startSlice, ...item, ...endSlice])
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
                const [vl, isHeader] = parseHeader(value)
                ln[index].content = vl
                ln[index].header = isHeader
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
                <LineComponent
                    onPaste={(e) => {
                        const paste = e.clipboardData.getData('text')
                        if (!paste || paste.length == 0) return
                        e.preventDefault()

                        const pasteLines = paste.split('\n')
                        const currentLine = pasteLines.shift()!

                        update(currentLine, i)
                        addMultiple(pasteLines, i + 1)
                        setFocused(i + pasteLines.length)
                    }}
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
        addMultiple,
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
