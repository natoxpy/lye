'use client'
import IconEditLyrics from '@/app/icons/editLyrics'
import IconSyncLines from '@/app/icons/syncLines'
import IconSyncLyrics from '@/app/icons/syncLyrics'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Component() {
    const pathname = usePathname()
    let page

    if (pathname.startsWith('/workspaces/main/edit')) page = 'edit'
    else if (pathname.startsWith('/workspaces/main/sync')) page = 'sync'
    else page = 'perfect-sync'

    const LinkItem = ({
        name,
        pathname,
        Icon,
    }: {
        name: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Icon: any
        pathname?: string
    }) => (
        <Link
            href={`/workspaces/main/${name}${pathname ?? ''}`}
            style={{
                backgroundColor: page == name ? 'var(--color-bg-4)' : '',
            }}
            className="group outline-none focus:bg-bg-5 hover:bg-bg-4 cursor-pointer flex items-center w-[128px] h-full justify-center relative"
        >
            <Icon className="stroke-txt-2" />
            <div
                style={{
                    backgroundColor:
                        page == name ? 'var(--color-accent-1)' : '',
                    opacity: page == name ? '1' : '',
                }}
                className="bottom-0 absolute w-full h-[2px] group-focus:bg-accent-1 opacity-50"
            ></div>
        </Link>
    )

    return (
        <div className="flex justify-center w-full min-h-[48px] bg-bg-2 border-[1px] border-bg-2">
            <LinkItem name="edit" pathname="/original" Icon={IconEditLyrics} />
            <LinkItem name="sync" Icon={IconSyncLines} />
            <LinkItem name="perfect-sync" Icon={IconSyncLyrics} />
        </div>
    )
}
