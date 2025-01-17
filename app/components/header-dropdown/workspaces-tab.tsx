import PlusCircleIcon from '@/app/components/icons/plusCircle'
import { forwardRef } from 'react'

function WorkspaceItem({
    name,
    image,
    active,
    onClick,
}: {
    name: string
    image: string
    active?: boolean
    onClick: () => void
}) {
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
            <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
                <span
                    style={{
                        color: active ? 'var(--color-txt-2)' : '',
                        fontWeight: active ? '700' : '',
                    }}
                    className="text-[14px] text-txt-1 transition-all"
                >
                    {name}
                </span>
            </div>
        </div>
    )
}

const WorkspacesTab = forwardRef<HTMLDivElement, { selectItem: () => void }>(
    (props, ref) => {
        return (
            <div
                ref={ref}
                className="flex flex-col w-[500px] p-[15px] rounded-lg gap-[10px]"
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
                    <WorkspaceItem
                        active
                        name="Iron Lotus"
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F66179b862f9f1521b10319874d2bb522.1000x1000x1.jpg"
                        onClick={props.selectItem}
                    />
                    <WorkspaceItem
                        name="Through Patches of Violet"
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F0d35c4ab953fe95571a0f9647fc705f4.741x741x1.png"
                        onClick={props.selectItem}
                    />
                    <WorkspaceItem
                        name="In Hell We Live, Lament"
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F3ce0d6f8313b5417c572c2eb585ea4dd.1000x1000x1.png"
                        onClick={props.selectItem}
                    />
                    <WorkspaceItem
                        name="Iron Lotus"
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F66179b862f9f1521b10319874d2bb522.1000x1000x1.jpg"
                        onClick={props.selectItem}
                    />
                    <WorkspaceItem
                        name="Through Patches of Violet"
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F0d35c4ab953fe95571a0f9647fc705f4.741x741x1.png"
                        onClick={props.selectItem}
                    />
                    <WorkspaceItem
                        name="In Hell We Live, Lament"
                        image="https://t2.genius.com/unsafe/474x474/https%3A%2F%2Fimages.genius.com%2F3ce0d6f8313b5417c572c2eb585ea4dd.1000x1000x1.png"
                        onClick={props.selectItem}
                    />
                </div>
            </div>
        )
    }
)

WorkspacesTab.displayName = 'WorkspacesTab'
export default WorkspacesTab
