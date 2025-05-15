'use client'
// import { usePlainLyricsLinesWorkspace } from '@/states/store-plain-lyrics'
import SyncLine from '@/app/components/sync-line'
import { useParams } from 'next/navigation'
import { UNAME } from '@/utils/units'
// import { useEffect } from 'react'
import { useLyrics, useSynchronizer } from '@/states/hooks'
import { useEffect } from 'react'

function Lines() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const lyricsWorkspaces = useLyrics((state) =>
        state.workspaces.find((v) => v.workspace == workspace)
    )

    return (
        <>
            {lyricsWorkspaces?.lyrics.map((sections, i) => (
                <div className="h-fit flex flex-col gap-1" key={i}>
                    <div className="flex items-center justify-center rounded-md h-10 w-full">
                        <span
                            className="text-txt-3 text-[22px]"
                            id={sections.header.id}
                        >
                            {sections.header.content}
                        </span>
                    </div>

                    <div className="flex-col overflow-hidden rounded">
                        {sections.content.map((line, i) => (
                            <SyncLine
                                key={i}
                                content={line.content}
                                synced={Boolean(Math.floor(0))}
                                left={-100}
                                line={i + 1}
                                onClick={() => {}}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

function SideHeaderNavigation() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const lyricsWorkspaces = useLyrics((state) =>
        state.workspaces.find((v) => v.workspace == workspace)
    )

    const { setMaxwidthFromDuration } = useSynchronizer((state) => state)

    return (
        <div className="flex flex-col pt-[20px]">
            {lyricsWorkspaces?.lyrics.map((section, i) => (
                <a
                    href={'#' + section.header.id}
                    className="flex justify-end px-3 py-2 rounded group cursor-pointer"
                    key={i}
                    onClick={() => {
                        setMaxwidthFromDuration(1000 * 30)
                    }}
                >
                    <span className="text-[16px] text-txt-3 group-hover:text-txt-2">
                        {section.header.content}
                    </span>
                </a>
            ))}
        </div>
    )
}

export default function Page() {
    return (
        <div className="h-full flex flex-row gap-8 overflow-hidden">
            <div className="flex flex-col items-end w-64 mt-4">
                <SideHeaderNavigation />
            </div>
            <div className="h-full scroll-smooth overflow-auto pt-4 pb-[230px] no-scrollbar flex flex-col gap-4">
                <Lines />
            </div>

            <div className="w-64"></div>
        </div>
    )
}
