import LeftArrowIcon from '@/app/components/icons/leftArrow'
import UploadIcon from '@/app/components/icons/upload'
import { useWorkspaces } from '@/states/hooks'
import { forwardRef, useEffect, useState } from 'react'
import { updateWorkspace } from '@/states/persistance'

const WorkspaceItemTab = forwardRef<
    HTMLDivElement,
    { prevPage: () => void; nextPage: () => void; workspace: string }
>((props, ref) => {
    const workspace = useWorkspaces((state) =>
        state.workspaces.find((w) => w.shorthand_id === props.workspace)
    )

    const [titleValue, setTitleValue] = useState<string | null>()
    const [artistValue, setArtistValue] = useState('')
    const [albumValue, setAlbumValue] = useState('')

    const updateWorkspaceLocal = useWorkspaces((state) => state.actions.update)

    useEffect(() => {
        if (!workspace) return

        setTitleValue(workspace.title)
        setArtistValue(workspace.meta.artist)
        setAlbumValue(workspace.meta.album)
    }, [workspace])

    if (workspace === undefined) return <></>

    return (
        <div
            ref={ref}
            className="flex flex-col w-[300px] h-fit p-[15px] rounded-lg gap-[10px]"
        >
            <div className="flex items-center justify-between px-[10px]">
                <div className="flex items-center justify-start gap-[10px]">
                    <div
                        onClick={props.prevPage}
                        className="cursor-pointer text-txt-1 hover:text-txt-2"
                    >
                        <LeftArrowIcon />
                    </div>

                    <input
                        value={titleValue ?? ''}
                        onInput={(e) => {
                            setTitleValue(e.currentTarget.value)

                            if (!workspace.id) return

                            const obj = {
                                ...workspace,
                                title: e.currentTarget.value,
                            }

                            updateWorkspaceLocal(obj)
                            updateWorkspace(obj)
                        }}
                        className="text-txt-2 text-[18px] bg-transparent outline-none border-none w-48"
                    />
                </div>
                <div
                    onClick={props.nextPage}
                    className="cursor-pointer text-txt-1 hover:text-txt-2"
                >
                    <UploadIcon className="w-[20px] h-[20px] stroke-txt-1" />
                </div>
            </div>
            <div className="px-[10px]">
                <div className="flex h-[45px]">
                    <div className="flex items-center justify-end min-w-[60px] px-[5px]">
                        <span className="text-txt-2 text-[14px] font-semibold">
                            Artist
                        </span>
                    </div>
                    <div className="flex items-center px-[10px]">
                        <input
                            value={artistValue}
                            onInput={(e) => {
                                setArtistValue(e.currentTarget.value)

                                if (!workspace.id) return
                                const obj = {
                                    ...workspace,
                                    meta: {
                                        ...workspace.meta,
                                        artist: e.currentTarget.value,
                                    },
                                }

                                updateWorkspaceLocal(obj)
                                updateWorkspace(obj)
                            }}
                            className="text-txt-2 flex text-[14px] w-full h-[24px] border-b-[1px] border-bg-5 bg-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="flex h-[45px]">
                    <div className="flex items-center justify-end min-w-[60px] px-[5px]">
                        <span className="text-txt-2 text-[14px] font-semibold">
                            Album
                        </span>
                    </div>
                    <div className="flex items-center px-[10px]">
                        <input
                            value={albumValue}
                            onInput={(e) => {
                                setAlbumValue(e.currentTarget.value)

                                if (!workspace.id) return
                                const obj = {
                                    ...workspace,
                                    meta: {
                                        ...workspace.meta,
                                        album: e.currentTarget.value,
                                    },
                                }

                                updateWorkspaceLocal(obj)
                                updateWorkspace(obj)
                            }}
                            className="text-txt-2 flex text-[14px] w-full h-[24px] border-b-[1px] border-bg-5 bg-transparent outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
})

WorkspaceItemTab.displayName = 'WorkspaceItemTab'
export default WorkspaceItemTab
