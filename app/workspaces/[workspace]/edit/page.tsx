'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
    const { workspace } = useParams<{
        workspace: string
    }>()
    const router = useRouter()

    useEffect(() => {
        router.push(`/workspaces/${workspace}/edit/original`)
    })

    return <div className="w-full h-full"></div>
}
