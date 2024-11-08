'use client'
import { useEffect, useRef, useState as useReactState } from 'react'
import { redirect } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { HEADER_INITIAL, syncLines, useLines } from '@/store/stores/lyrics'
import { useParams } from 'next/navigation'

function Editor() {
    const { workspace, variant } = useParams<{
        workspace: string
        variant: string
    }>()

    // Redirect function should ensure this isn't undefined
    const lines = useAppSelector(useLines(workspace, variant))!
    const dispatch = useAppDispatch()

    const textarea = useRef<HTMLTextAreaElement>(null)
    const [previosCursor, setPreviousCursor] = useReactState<number | null>(
        null
    )

    useEffect(() => {
        const element = textarea.current
        if (!element) return
        const h = lines.length * 60 + 'px'
        element.style.height = h

        element.scrollTo(0, 0)

        if (previosCursor !== null) {
            setPreviousCursor(null)
            element.selectionStart = previosCursor
            element.selectionEnd = previosCursor
        }
    }, [lines, previosCursor, setPreviousCursor])

    return (
        <div
            className="w-full h-full relative"
            onClick={() => textarea.current!.focus()}
        >
            <div className="absolute w-full top-0 z-10 pointer-events-none">
                {lines.map((line, idx) => (
                    <div
                        key={idx}
                        className="w-full flex items-center h-[60px]"
                    >
                        <pre
                            style={{
                                color: line.content.startsWith(HEADER_INITIAL)
                                    ? 'var(--color-txt-1)'
                                    : 'var(--color-txt-2)',
                            }}
                            className="w-full text-[24px] select-none"
                        >
                            {line.content}
                        </pre>
                    </div>
                ))}
            </div>

            <textarea
                ref={textarea}
                value={lines.map((line) => line.content).join('\n')}
                onChange={(e) => {
                    const lines = e.target.value.split('\n')

                    // console.log(lines)

                    dispatch(
                        syncLines({
                            lines,
                            workspaceId: workspace,
                            variantId: variant,
                        })
                    )
                }}
                style={{ lineHeight: '60px' }}
                className="w-full h-full overflow-hidden text-txt-2 text-[24px] outline-none resize-none bg-transparent"
            />
        </div>
    )
}

function Lines() {
    const { workspace, variant } = useParams<{
        workspace: string
        variant: string
    }>()

    // Redirect function should ensure this isn't undefined
    const lines = useAppSelector(useLines(workspace, variant))!

    const LineNumber = ({ num }: { num: string; id: string }) => (
        <div className="flex min-w-[80px] justify-end items-center w-full min-h-[60px] pr-[25px]">
            <span className="text-[20px] text-txt-1 select-none">{num}</span>
        </div>
    )

    return (
        <div className="flex flex-col w-[85px] h-full">
            {lines.map((line, idx) => {
                return (
                    <LineNumber
                        key={idx}
                        id={line.id}
                        num={
                            line.content.startsWith(HEADER_INITIAL)
                                ? '~'
                                : String(idx + 1)
                        }
                    />
                )
            })}
        </div>
    )
}

function Redirect() {
    const { workspace, variant } = useParams<{
        workspace: string
        variant: string
    }>()
    const lines = useAppSelector(useLines(workspace, variant))
    if (lines == undefined) redirect(`/workspaces/${workspace}/edit`)

    return <></>
}

export default function Page() {
    return (
        <>
            <Redirect />
            <div className="flex w-full max-h-[100%-25px] h-full bg-bg-4 overflow-y-scroll">
                <div className="flex w-full h-full">
                    <Lines />
                    <Editor />
                </div>
            </div>
        </>
    )
}
