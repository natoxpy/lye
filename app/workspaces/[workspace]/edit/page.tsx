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
import { useEffect, useState } from 'react'
import PlayIcon from '@/app/components/icons/play'
import PauseIcon from '@/app/components/icons/pause'
import useAudio from '@/app/components/audio'
import { formatS } from '@/utils/time'

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

    const audio = useAudio()

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

            <div className="flex items-center relative w-full h-[50px] bg-bg-3 shadow-top-shadow shadow-bg-2 p-2 z-30">
                <div
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

                <div className="flex w-full items-center gap-4">
                    <div className="flex items-center justify-center h-[50px] min-w-[60px]">
                        <span className="text-txt-3 select-none">
                            {formatS(audio.currentTime * 1000)}
                        </span>
                    </div>
                    <div className="flex items-center w-full h-[25px] cursor-pointer group/seekbar">
                        <div className="flex items-center rounded w-full h-[5px] bg-bg-5">
                            <div
                                style={{
                                    width: `${(audio.currentTime / (audio.duration > 0 ? audio.duration : 1)) * 100}%`,
                                }}
                                className="rounded h-[4px] bg-bg-6 group-hover/seekbar:bg-txt-3 transition-all"
                            ></div>
                            <div className="relative rounded-full -left-[8px] w-[8px] h-[8px] bg-txt-1 group-hover/seekbar:bg-txt-2 transition-all"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center h-[50px] min-w-[60px]">
                        <span className="text-txt-3 select-none">
                            {formatS(audio.duration * 1000)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
