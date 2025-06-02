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
    const [mouseSelection, setMouseSelection] = useState<number | null>(null)
    const [rangeSelection, setRangeSelection] = useState<{
        start: number
        end: number
    } | null>(null)

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

                console.log(content, header)

                return {
                    id: hash(String(Math.random())),
                    content,
                    header: header,
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
                const [vl, header] = parseHeader(value)
                ln[index].content = vl
                if (header) ln[index].header = header
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

    const removeMultiple = useCallback(
        (index: [number, number]) => {
            if (lines.length - 1 - (index[1] - index[0]) == 0) {
                const item = {
                    id: hash(String(Math.random())),
                    content: '',
                    header: true,
                }

                setFocused(0)

                return setLines([item])
            }

            const startSlice = lines.slice(0, index[0])
            const endSlice = lines.slice(index[1] + 1)

            if (index[0] == 0) setFocused(index[0] + 1)
            else setFocused(index[0] - 1)

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
        const localOnKeyDown = (e: globalThis.KeyboardEvent) => {
            if (rangeSelection == null) return
            if (e.key == 'Backspace' || e.key == 'Delete') {
                e.preventDefault()
                removeMultiple([
                    Math.min(rangeSelection.start, rangeSelection.end),
                    Math.max(rangeSelection.start, rangeSelection.end),
                ])
            }

            setTimeout(() => {
                setRangeSelection(null)
            }, 1)
        }

        document.addEventListener('keydown', localOnKeyDown)
        return () => {
            document.removeEventListener('keydown', localOnKeyDown)
        }
    })

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
                    onMouseDown={() => {
                        setMouseSelection(i)
                        setRangeSelection({
                            start: i,
                            end: i,
                        })
                    }}
                    onMouseUp={() => {
                        setMouseSelection(null)
                    }}
                    onCustomHover={() => {
                        if (mouseSelection == null) return

                        setMouseSelection(i)

                        setRangeSelection({
                            start: rangeSelection?.start ?? i,
                            end: i,
                        })
                    }}
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
                    isOnSelectionRange={
                        rangeSelection == null ||
                        rangeSelection.start == rangeSelection.end
                            ? false
                            : (rangeSelection.start >= i &&
                                  rangeSelection.end <= i) ||
                              (rangeSelection.end >= i &&
                                  rangeSelection.start <= i)
                    }
                    onRef={(ref) => {
                        if (
                            rangeSelection != null &&
                            rangeSelection.start != rangeSelection.end
                        ) {
                            setFocused(null)
                            return ref.blur()
                        } else {
                        }

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
        mouseSelection,
        rangeSelection,
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
