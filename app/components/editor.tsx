'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

export const HEADER_PREFIX = '\u200B'

const LINE_HEIGHT = 60

const HeaderLineNumberPlaceholder = '#'
const HeaderLineNumberReplacement = '#'

function isHeaderLine(v: string) {
    return v.trim().startsWith(HeaderLineNumberReplacement) || v.trim().startsWith(HEADER_PREFIX)
}

function LineNumbers({ lines }: { lines: string[] }) {
    return (
        <>
            {lines.map((line, key) => (
                <div
                    style={{
                        backgroundColor:
                            key == -1 ? 'rgba(255,255,255,0.5)' : '',
                        height: LINE_HEIGHT + 'px',
                    }}
                    className="flex pointer-events-none items-center justify-end pr-[25px]"
                    key={key}
                >
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

    return (
        <div
            className={
                'flex w-full h-full pt-3 overflow-y-auto overflow-x-hidden overscroll-none'
            }
            onClick={() => {
                const element = textareaRef.current
                if (!element) return
                if (!textareaFocus) element.focus()
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

    return (
        <Layout
            content={lines}
            setContent={(v) => {
                setLines(
                    v.map((c) => {
                        if (c.startsWith(HeaderLineNumberReplacement))
                            return c.replace(HeaderLineNumberReplacement, HEADER_PREFIX)
                        return c
                    })
                )
            }}
            numbers={<LineNumbers lines={getLineNumbers()} />}
            lines={lines.map((c, key) => (
                <div key={key} className="flex">
                    <span
                        style={{
                            color: isHeaderLine(c)
                                ? 'var(--color-txt-1)'
                                : 'var(--color-txt-2)',
                        }}
                        className="grow-0 whitespace-nowrap flex items-center select-none text-[24px] min-h-[60px]"
                    >
                        <pre>{c}</pre>
                    </span>
                    {isHeaderLine(c) ? (
                        <div className="flex pl-5 grow-[1] items-center min-h-[60px]">
                            <div className="w-full h-[3px] bg-bg-6 opacity-35"></div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ))}
        />
    )
}
