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

function EditorLoader() {
    return (
        <>
            <div className="bg-bg-4 h-full pt-3">
                <div className="flex flex-col animate-pulse">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center w-full min-h-[60px] pr-[25px]"
                        >
                            <div className="flex min-w-[85px] h-30px justify-end text-[20px] pr-[25px]">
                                <span className="text-txt-1"></span>
                            </div>
                            <div className="w-full h-[30px]  bg-bg-5 opacity-50 rounded-xl"></div>
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
        if (lines != null) return;
        setLines(plainLyrics.find(pl => pl.workspace == workspace)?.content.split("\n") ?? null);
    }, [lines, plainLyrics, workspace])

    useEffect(() => {
        if (!lines) {
            addLines(workspace)

            return
        }

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

            <div className="relative w-full h-[50px] bg-bg-3"></div>
        </div>
    )
}
