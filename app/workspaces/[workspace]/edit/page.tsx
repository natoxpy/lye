'use client'
import Editor from '@/app/components/editor'
import { usePlainLyrics } from '@/states/hooks'
import { PersistanceEmitter, updatePlainlyrics } from '@/states/persistance'
import {
    plainLyricsStore,
    usePlainLyricsWorkspace,
} from '@/states/store-plain-lyrics'
import { UNAME } from '@/utils/units'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import PlayIcon from '@/app/components/icons/play'
import PauseIcon from '@/app/components/icons/pause'
// import useAudio from '@/app/components/audio'
import { formatS } from '@/utils/time'
import { useAudio } from '@/app/components/audio/index'

function EditorLoader() {
    return (
        <>
            <div className="bg-bg-3 h-full pt-3">
                <div className="flex flex-col animate-pulse">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center w-full min-h-[60px] pr-[25px]"
                        >
                            <div className="flex min-w-[85px] h-30px justify-end text-[20px] pr-[25px]">
                                <span className="text-txt-1"></span>
                            </div>
                            <div className="w-full h-[30px]  bg-bg-4 opacity-35 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default function Page() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const [lines, setLines] = useState<string[] | null>(
        usePlainLyricsWorkspace(workspace)
    )
    const plainLyrics = usePlainLyrics((state) => state.lyrics)
    const workspacesLyricsList = usePlainLyrics((state) => state.lyrics)

    const updateLyrics = usePlainLyrics((state) => state.actions.updateLyrics)
    const addLines = usePlainLyrics((state) => state.actions.add)

    useEffect(() => {
        if (lines != null) return
        setLines(
            plainLyrics
                .find((pl) => pl.workspace == workspace)
                ?.content.split('\n') ?? null
        )
    }, [lines, plainLyrics, workspace])

    useEffect(() => {
        if (!lines) return

        updateLyrics(workspace, lines.join('\n'))

        const workspaceData = workspacesLyricsList.find(
            (w) => w.workspace === workspace
        )

        if (!workspaceData) return

        updatePlainlyrics(workspaceData)
    }, [lines, updateLyrics, addLines, workspace, workspacesLyricsList])

    useEffect(() => {
        const handler = () => {
            if (lines !== null) return
            const workspaceData = plainLyricsStore
                .getState()
                .lyrics.find((w) => w.workspace == workspace)

            if (!workspaceData) return
            setLines(workspaceData.content.split('\n'))
        }
        PersistanceEmitter.addEventListener('rerender', handler)
        return () => PersistanceEmitter.removeEventListener('rerender', handler)
    }, [lines, setLines, workspace])

    return (
        <div className="w-screen relative pb-[50px]">
            {lines == null ? (
                <EditorLoader />
            ) : (
                <Editor lines={lines} setLines={setLines} />
            )}

            <EditPlayer />
        </div>
    )
}

export function EditPlayer() {
    const seekbarRef = useRef<HTMLDivElement>(null)
    const audio = useAudio()
    const [dragging, setDragging] = useState(false)
    const [dragPerct, setDragPerct] = useState(0)

    const computeDragPerct = useCallback(
        (e: MouseEvent) => {
            const element = seekbarRef.current
            if (!element) return 0
            const box = element.getBoundingClientRect()
            const perct =
                Math.max(Math.min(e.clientX - box.left, box.width), 0) /
                box.width
            setDragPerct(perct)
            audio.play()
            return perct
        },
        [audio]
    )

    useEffect(() => {
        const seekbarElement = seekbarRef.current
        if (!seekbarElement) return

        const onMouseDown = (e: MouseEvent) => {
            setDragging(true)
            computeDragPerct(e)
        }

        const onMouseUp = (e: MouseEvent) => {
            if (!dragging) return
            setDragging(false)
            if (!audio) return
            audio.currentTime = computeDragPerct(e) * audio.duration
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return
            computeDragPerct(e)
        }

        seekbarElement.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousemove', onMouseMove)

        return () => {
            seekbarElement.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mousemove', onMouseMove)
        }
    }, [audio, dragging, computeDragPerct])

    

    const getSeekbarWidth = () => {
        if (audio.duration == 0) return 0
        if (dragging) return (audio.duration * dragPerct) / audio.duration
        return audio.currentTime / audio.duration
    }

    return (
        <div
            style={{
                opacity: audio.duration == 0 ? 0.5 : 1,
                cursor: audio.duration == 0 ? 'not-allowed' : 'default',
            }}
            className="flex items-center relative w-full h-[50px] bg-bg-3 shadow-top-shadow shadow-bg-2 p-2 z-30"
        >
            <div
                style={{
                    pointerEvents: audio.duration == 0 ? 'none' : 'initial',
                }}
                onClick={() => {
                    if (audio.paused) audio.play()
                    else audio.pause()
                }}
                className="flex items-center justify-center group/playbtn h-[50px] w-[80px] cursor-pointer"
            >
                {audio.paused ? (
                    <PlayIcon
                        widths={50}
                        className="stroke-txt-3 group-hover/playbtn:stroke-txt-2"
                    />
                ) : (
                    <PauseIcon
                        widths={50}
                        className="stroke-txt-3 group-hover/playbtn:stroke-txt-2"
                    />
                )}
            </div>

            <div
                style={{
                    pointerEvents: audio.duration == 0 ? 'none' : 'initial',
                }}
                className="flex w-full items-center gap-4"
            >
                <div className="flex items-center justify-center h-[50px] min-w-[60px]">
                    <span className="text-txt-3 select-none">
                        {formatS(audio.currentTime * 1000)}
                    </span>
                </div>
                <div
                    className="flex items-center w-full h-[35px] cursor-pointer group/seekbar"
                    id="seekbar-interactive"
                    ref={seekbarRef}
                >
                    <div className="flex items-center rounded w-full h-[5px] bg-bg-5">
                        <div
                            style={{
                                background: dragging
                                    ? 'var(--color-txt-3)'
                                    : '',
                                width: `${getSeekbarWidth() * 100}%`,
                            }}
                            className="rounded h-[4px] bg-bg-6 group-hover/seekbar:bg-txt-3 transition-colors"
                        ></div>
                        <div
                            style={{
                                background: dragging
                                    ? 'var(--color-txt-2)'
                                    : '',
                            }}
                            className="relative rounded-full w-[8px] h-[8px] bg-txt-1 group-hover/seekbar:bg-txt-2 transition-all"
                        ></div>
                    </div>
                </div>
                <div className="flex items-center justify-center h-[50px] min-w-[60px]">
                    <span className="text-txt-3 select-none">
                        {formatS(audio.duration * 1000)}
                    </span>
                </div>
            </div>
        </div>
    )
}
