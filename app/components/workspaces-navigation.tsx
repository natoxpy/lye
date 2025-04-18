'use client'
import IconEditLyrics from '@/app/components/icons/editLyrics'
import IconSyncLines from '@/app/components/icons/syncLines'
import { UNAME } from '@/utils/units'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function Component() {
    const { workspace } = useParams<{ workspace: UNAME }>()
    const pathname = usePathname()
    let page = ''

    if (pathname.endsWith(`/workspaces/${workspace}/edit`)) page = 'edit'
    else if (pathname.startsWith(`/workspaces/${workspace}/sync`)) page = 'sync'

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
            href={`/workspaces/${workspace}/${name}${pathname ?? ''}`}
            style={{
                backgroundColor: page == name ? 'var(--color-bg-4)' : '',
            }}
            tabIndex={page == name ? -1 : 0}
            className="group outline-none focus-visible:bg-bg-5 hover:bg-bg-4 cursor-pointer flex items-center w-[128px] h-full justify-center relative"
        >
            <Icon className="stroke-txt-2" />
            <div
                style={{
                    backgroundColor:
                        page == name ? 'var(--color-accent-1)' : '',
                    opacity: page == name ? '1' : '',
                }}
                className="bottom-0 absolute w-full h-[2px] group-focus-visible:bg-accent-1 opacity-50"
            ></div>
        </Link>
    )

    return (
        <div className="flex justify-center w-full min-h-[48px] bg-bg-2 border-[1px] border-bg-2">
            <LinkItem name="edit" Icon={IconEditLyrics} />
            <LinkItem name="sync" Icon={IconSyncLines} />
            {/* <LinkItem name="perfect-sync" Icon={IconSyncLyrics} /> */}
        </div>
    )
}
