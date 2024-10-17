'use client'
import { useEffect, useRef, useState as useReactState } from 'react'
import { HEADER_INITIAL, StateLines, useDispatch, useState } from '../state'
import { redirect } from 'next/navigation'

function Editor({ variant }: { variant: string }) {
    const { lines } = useState()
    const variantLines = lines[variant]
    const dispatch = useDispatch()
    const textarea = useRef<HTMLTextAreaElement>(null)
    const [previosCursor, setPreviousCursor] = useReactState<number | null>(
        null
    )

    useEffect(() => {
        const element = textarea.current
        if (!element) return
        const h = variantLines.length * 60 + 'px'
        element.style.height = h

        element.scrollTo(0, 0)

        if (previosCursor !== null) {
            setPreviousCursor(null)
            element.selectionStart = previosCursor
            element.selectionEnd = previosCursor
        }
    }, [variantLines, previosCursor, setPreviousCursor])

    return (
        <div
            className="w-full h-full relative"
            onClick={() => textarea.current!.focus()}
        >
            <div className="absolute w-full top-0 z-10 pointer-events-none">
                {variantLines.map((line) => (
                    <div
                        key={line.id}
                        className="w-full flex items-center h-[60px]"
                    >
                        <pre
                            style={{
                                color:
                                    line.type == 'header'
                                        ? 'var(--color-txt-1)'
                                        : 'var(--color-txt-2)',
                            }}
                            className="w-full text-[24px]"
                        >
                            {line.content}
                        </pre>
                    </div>
                ))}
            </div>

            <textarea
                ref={textarea}
                value={variantLines.map((line) => line.content).join('\n')}
                onChange={(e) => {
                    const generateId = () =>
                        'i' + Math.floor(Math.random() * 10_000_000)

                    let skip = 0
                    let nlines = e.target.value
                        .split('\n')
                        .map((content, idx) => {
                            if (content.startsWith('~')) {
                                setPreviousCursor(
                                    textarea.current!.selectionStart ?? 0
                                )
                            }

                            if (
                                content.startsWith(HEADER_INITIAL) ||
                                content.startsWith('~')
                            ) {
                                skip += 1

                                return {
                                    content,
                                    type: 'header',
                                    lineNumber: idx + 1 - skip,
                                    id: generateId(),
                                }
                            }

                            return {
                                content,
                                type: 'content',
                                lineNumber: idx + 1 - skip,
                                id: generateId(),
                            }
                        })

                    nlines = nlines.map((line) => {
                        if (line.content.startsWith('~')) {
                            return {
                                content:
                                    HEADER_INITIAL +
                                    line.content.split('~')[1].trim(),
                                id: line.id,
                                lineNumber: line.lineNumber,
                                type: 'header',
                            }
                        }

                        return line
                    })

                    dispatch({
                        type: 'set-lines',
                        payload: {
                            lines: nlines as StateLines,
                            variantId: variant,
                        },
                    })
                }}
                style={{ lineHeight: '60px' }}
                className="w-full h-full overflow-hidden text-txt-2 text-[24px] outline-none resize-none bg-transparent"
            />
        </div>
    )
}

function Lines({ variant }: { variant: string }) {
    const { lines } = useState()
    const variantLines = lines[variant]

    const LineNumber = ({ num }: { num: string; id: string }) => (
        <div className="flex min-w-[80px] justify-end items-center w-full min-h-[60px] pr-[25px]">
            <span className="text-[20px] text-txt-1">{num}</span>
        </div>
    )

    return (
        <div className="flex flex-col w-[85px] h-full">
            {variantLines.map((line) => {
                return (
                    <LineNumber
                        key={line.id}
                        id={line.id}
                        num={
                            line.type == 'header'
                                ? '~'
                                : String(line.lineNumber)
                        }
                    />
                )
            })}
        </div>
    )
}

function Redirect({ variantId }: { variantId: string }) {
    const { lines } = useState()
    if (lines[variantId] == undefined) redirect('/workspaces/main/edit/')
    return <></>
}

export default function Page({
    params: { variantId },
}: {
    params: { variantId: string }
}) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type: 'set-active-workspace',
            payload: { id: variantId },
        })
    })

    return (
        <>
            <Redirect variantId={variantId} />
            <div className="flex w-full max-h-[100%-25px] h-full bg-bg-4 overflow-y-scroll">
                <div className="flex w-full h-full">
                    <Lines variant={variantId} />
                    <Editor variant={variantId} />
                </div>
            </div>
        </>
    )
}
