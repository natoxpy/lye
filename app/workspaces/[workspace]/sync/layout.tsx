'use client'
import React from 'react'
// import { usePlainLyricsLinesWorkspace } from '@/states/store-plain-lyrics'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { UNAME } from '@/utils/units'

function NoLines({ workspaceId }: { workspaceId: string }) {
    return (
        <div className="flex flex-col mt-8 rounded-2xl items-center justify-center w-[600px] bg-bg-3 px-[50px] py-[25px]">
            <div className="flex flex-col items-center justify-center gap-5 h-[105px]">
                <span className="text-[24px] text-txt-2">
                    Nothing To Do Here!
                </span>
                <span className="text-[14px] text-txt-1">
                    Add some lyrics, then come back to sync them.
                </span>
            </div>

            <div className="flex flex-col items-center justify-center h-[75px]">
                <Link
                    className="px-8 py-4 rounded-[6px] text-[16px] font-semibold text-txt-2 bg-accent-blue"
                    href={`/workspaces/${workspaceId}/edit`}
                >
                    Return To Edit
                </Link>
            </div>
        </div>
    )
}

export default function Layout({
    children,
    synchronizer,
}: {
    children: React.ReactNode
    synchronizer: React.ReactNode
}) {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const hasNoLines = false

    return (
        <div
            style={{
                height: 'calc(100% - (40px + 48px))',
            }}
            className="grow flex flex-col relative"
        >
            <div className="grow flex flex-col items-center overflow-y-auto gap-4">
                {hasNoLines ? <NoLines workspaceId={workspace} /> : children}
            </div>

            <div className="absolute p-1 w-[calc(100%-200px)] left-[100px] bottom-[35px] rounded-md overflow-hidden">
                <div className="rounded overflow-hidden">{synchronizer}</div>
            </div>
        </div>
    )
}
