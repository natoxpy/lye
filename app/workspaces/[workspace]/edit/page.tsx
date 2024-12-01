'use client'
import Editor from '@/app/components/editor'
import { usePlainLyrics } from '@/states/plain-lyrics'
import { UNAME } from '@/utils/units'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const [lines, setLines] = useState<string[]>([''])
    const updateLyrics = usePlainLyrics((state) => state.actions.updateLyrics)

    useEffect(() => {
        updateLyrics(workspace, lines.join('\n'))
    }, [lines, updateLyrics, workspace])

    return (
        <div className="w-full h-full">
            <Editor lines={lines} setLines={setLines} />
        </div>
    )
}
