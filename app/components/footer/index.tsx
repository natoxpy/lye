'use client'
import EditLyricsIcon from '@/app/components/icons/EditLyrics'
import SyncLinesIcon from '@/app/components/icons/SyncLines'
import SyncSpecificIcon from '@/app/components/icons/SyncSpecific'
import { IconFile } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Component() {
    const pathname = usePathname()
    console.log()

    const LinkItem = ({
        Icon,
        name
    }: {
        Icon: typeof IconFile | typeof EditLyricsIcon
        name: string
    }) => (
        <Link href={'/' + name}>
            <div
                style={{
                    background: pathname.startsWith('/' + name) ? 'var(--text-900)' : ''
                }}
                className="flex items-center justify-center h-10 w-32"
            >
                <Icon width="24" height="24" color="currentColor" />
            </div>
        </Link>
    )

    return (
        <>
            <div className="flex items-center justify-center min-h-10 w-full bg-text-950 text-text-300">
                <LinkItem Icon={IconFile} name={'metadata'} />
                <LinkItem Icon={EditLyricsIcon} name={'lyrics'} />
                <LinkItem Icon={SyncLinesIcon} name={'timedlines'} />
                <LinkItem Icon={SyncSpecificIcon} name={'timedlyrics'} />
            </div>
        </>
    )
}
