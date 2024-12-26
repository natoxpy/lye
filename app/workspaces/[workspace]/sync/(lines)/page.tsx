'use client'
import { usePlainLyricsLinesWorkspace } from '@/states/plain-lyrics'
import SyncLine from '@/app/components/sync-line'
import { useParams } from 'next/navigation'
import { UNAME } from '@/utils/units'
import Link from 'next/link'

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
function Lines() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const lines = usePlainLyricsLinesWorkspace(workspace)

    const hasNoLines = lines.filter((a) => a.trim() !== '').length == 0
    if (hasNoLines) return <NoLines />

    return (
        <>
            {lines.map((ln, key) => (
                <SyncLine
                    key={key}
                    content={ln}
                    inTimeLine={true}
                    left={-100}
                    line={1}
                    onClick={() => {}}
                />
            ))}
        </>
    )
}

export default function Page() {
    return (
        <div className="h-fit flex flex-col gap-4">
            <Lines />
        </div>
    )
}
