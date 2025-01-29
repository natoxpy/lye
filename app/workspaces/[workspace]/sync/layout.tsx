'use client'
import React from 'react'
import { usePlainLyricsLinesWorkspace } from '@/states/plain-lyrics'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { UNAME } from '@/utils/units'

function NoLines() {
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
                    href={'/workspaces/main/edit'}
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
    const lines = usePlainLyricsLinesWorkspace(workspace)
    const hasNoLines = lines.filter((a) => a.trim() !== '').length == 0

    return (
        <div
            style={{
                height: 'calc(100% - (40px + 48px))',
            }}
            className="grow flex flex-col bg-bg-2"
        >
            <div className="grow flex flex-col items-center overflow-y-auto py-4 gap-4">
                {hasNoLines ? <NoLines /> : children}
            </div>
            {hasNoLines ? <></> : <div className="h-fit">{synchronizer}</div>}
        </div>
    )
}
