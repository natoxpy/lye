'use client'
import AudioProvider, { useAudio } from '@/app/components/audio/index'
import { useParams } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useWorkspaces } from '@/states/hooks'

function AudioSourceProvider({ children }: { children: ReactNode }) {
    const audio = useAudio()
    const { workspace: workspace_id } = useParams<{ workspace: string }>()
    const workspace = useWorkspaces((state) =>
        state.workspaces.find((w) => w.shorthand_id == workspace_id)
    )

    useEffect(() => {
        if (!workspace) return
        const fileblob = workspace.fileblob
        if (!fileblob || audio.src != '') return

        audio.src = URL.createObjectURL(fileblob)
    }, [workspace, audio])

    return <>{children}</>
}

export default function Layout({
    header,
    children,
    navigation,
}: {
    header: React.ReactNode
    children: React.ReactNode
    navigation: React.ReactNode
}) {
    return (
        <AudioProvider>
            <AudioSourceProvider>
                <div className="flex-col w-screen max-h-screen h-screen bg-bg-3 flex overflow-hidden">
                    {header}
                    {children}
                    {navigation}
                </div>
            </AudioSourceProvider>
        </AudioProvider>
    )
}
