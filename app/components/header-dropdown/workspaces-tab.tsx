'use client'
import PlusCircleIcon from '@/app/components/icons/plusCircle'
import OpenExternalLink from '@/app/components/icons/openExternalLink'
import { useHeader, useWorkspaces } from '@/states/hooks'
import { forwardRef } from 'react'
import { useRouter } from 'next/navigation'

function WorkspaceItem({
    id,
    name,
    image,
    active,
    onClick,
}: {
    id: string
    name: string
    image: string
    active?: boolean
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
                    router.push('/workspaces/' + id + '/edit')
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

const WorkspacesTab = forwardRef<HTMLDivElement, { selectItem: () => void }>(
    (props, ref) => {
        const workspaces = useWorkspaces((state) => state.workspaces)

        return (
            <div
                ref={ref}
                className="flex flex-col w-[350px] h-fit p-[15px] rounded-lg gap-[10px]"
            >
                <div className="flex items-center justify-between px-[10px]">
                    <div className="group cursor-pointer">
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
                            id={workspace.id}
                            name={workspace.title}
                            image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F66179b862f9f1521b10319874d2bb522.1000x1000x1.jpg"
                            onClick={props.selectItem}
                        />
                    ))}
                </div>
            </div>
        )
    }
)

WorkspacesTab.displayName = 'WorkspacesTab'
export default WorkspacesTab
