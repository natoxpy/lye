'use client'
import PlusCircleIcon from '@/app/components/icons/plusCircle'
import OpenExternalLink from '@/app/components/icons/openExternalLink'
import { useHeader, useWorkspaces } from '@/states/hooks'
import { forwardRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { addWorkspace } from '@/states/persistance'
import { useLocalState } from '@/states'

function WorkspaceItem({
    id,
    name,
    image,
    active,
    subpage,
    onClick,
}: {
    id: string
    name: string
    image: string
    active?: boolean
    subpage: string
    onClick: () => void
}) {
    const router = useRouter()
    const headerSetActive = useHeader((state) => state.actions.setActive)

    return (
        <div
            onClick={onClick}
            className="flex cursor-pointer items-center justify-center w-full h-[50px] p-[10px] gap-[10px] group hover:bg-bg-3 rounded transition-all"
        >
            <div>
                <div
                    style={{
                        background: `url(${image})`,
                        backgroundSize: 'cover',
                    }}
                    className="w-[36px] h-[36px] bg-slate-700 rounded"
                ></div>
            </div>
            <div
                style={{
                    color: active ? 'var(--color-txt-2)' : '',
                }}
                className="w-full text-txt-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
            >
                <span
                    style={{
                        fontWeight: active ? '700' : '',
                    }}
                    className="text-[14px] text-txt-1 transition-all"
                >
                    {name}
                </span>
            </div>
            <div
                className="flex justify-center rounded items-center group/open hover:bg-bg-5 w-[40px] h-[30px]"
                onClick={(e) => {
                    e.stopPropagation()
                    router.push('/workspaces/' + id + '/' + subpage)
                    headerSetActive(false)
                }}
            >
                <OpenExternalLink
                    className="stroke-txt-1 group-hover/open:stroke-txt-2"
                    widths={20}
                    height={20}
                />
            </div>
        </div>
    )
}

const WorkspacesTab = forwardRef<
    HTMLDivElement,
    { selectItem: () => void; setWorkspace: (workspace: string) => void }
>((props, ref) => {
    const workspaces = useWorkspaces((state) => state.workspaces)
    const { newWorkspace } = useLocalState()

    const pathname = usePathname()
    let subpage = 'edit'
    if (pathname.endsWith('sync')) subpage = 'sync'

    return (
        <div
            ref={ref}
            className="flex flex-col w-[350px] h-fit p-[15px] rounded-lg gap-[10px]"
        >
            <div className="flex items-center justify-between px-[10px]">
                <div
                    className="group cursor-pointer"
                    onClick={() => {
                        const id = crypto.randomUUID()
                        const shorthand_id = id.split('-')[0]

                        const obj = {
                            id: id as never,
                            shorthand_id: shorthand_id,
                            meta: { album: '', artist: '' },
                            title: 'Unnamed',
                            fileblob: undefined as never,
                        }

                        newWorkspace(obj)
                        addWorkspace(obj)
                    }}
                >
                    <PlusCircleIcon
                        className="stroke-txt-1 group-hover:stroke-txt-2"
                        widths={20}
                        height={20}
                    />
                </div>

                <span className="text-[18px] text-txt-2">Workspaces</span>
            </div>
            <div className="flex flex-col">
                {workspaces.map((workspace) => (
                    <WorkspaceItem
                        key={workspace.id}
                        id={workspace.shorthand_id}
                        name={workspace.title}
                        subpage={subpage}
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F66179b862f9f1521b10319874d2bb522.1000x1000x1.jpg"
                        onClick={() => {
                            props.selectItem()
                            props.setWorkspace(workspace.shorthand_id)
                        }}
                    />
                ))}
            </div>
        </div>
    )
})

WorkspacesTab.displayName = 'WorkspacesTab'
export default WorkspacesTab
