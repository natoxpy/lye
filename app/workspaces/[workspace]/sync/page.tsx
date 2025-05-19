'use client'
import SyncLine from '@/app/components/sync-line'
import { useParams } from 'next/navigation'
import { useLineSync, useLyrics, useSynchronizer } from '@/states/hooks'

function Lines() {
    const { workspace } = useParams<{ workspace: string }>()
    const lyricsWorkspaces = useLyrics((state) =>
        state.workspaces.find((v) => v.workspace == workspace)
    )

    const lineSyncWp = useLineSync((store) =>
        store.workspaces.find((w) => w.workspace == workspace)
    )
    const { lineSyncItems } = useLineSync((store) => store.actions)

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
                                start={
                                    lineSyncWp?.content.find(
                                        (ls) => ls.targetId == line.id
                                    )?.timerange.start
                                }
                                duration={
                                    lineSyncWp?.content.find(
                                        (ls) => ls.targetId == line.id
                                    )?.timerange.duration
                                }
                                synced={
                                    lineSyncWp?.content.findIndex(
                                        (ls) => ls.targetId == line.id
                                    ) != -1
                                }
                                line={i + 1}
                                onClick={() => {
                                    let duration =
                                        (sections.header.timerange?.end ?? 0) -
                                        (sections.header.timerange?.start ?? 0)

                                    if (duration <= 0) duration = 1000
                                    else duration /= sections.content.length

                                    lineSyncItems.add(workspace, {
                                        targetId: line.id,
                                        timerange: {
                                            start:
                                                (sections.header.timerange
                                                    ?.start ?? 0) +
                                                duration * i,
                                            duration: duration,
                                        },
                                    })
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </>
    )
}

function SideHeaderNavigation() {
    const { workspace } = useParams<{ workspace: string }>()
    const lyricsWorkspaces = useLyrics((state) =>
        state.workspaces.find((v) => v.workspace == workspace)
    )

    const { setMaxwidthFromDuration, setOffset } = useSynchronizer(
        (state) => state
    )

    return (
        <div className="flex flex-col pt-[20px]">
            {lyricsWorkspaces?.lyrics.map((section, i) => (
                <a
                    href={'#' + section.header.id}
                    className="flex justify-end px-3 py-2 rounded group cursor-pointer"
                    key={i}
                    onClick={() => {
                        const start = section.header.timerange?.start
                        const end = section.header.timerange?.end

                        if (start == undefined || end == undefined) return

                        setMaxwidthFromDuration(end - start)
                        setOffset(start)
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
