'use client'
import IconCarrot from '@/app/components/icons/carrot'
import UploadMusic from '@/app/components/icons/uploadMusic'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useWorkspaces } from '@/states/hooks'
import { WorkspacesDatabase } from '@/states/persistance'
import { Workspace } from '@/states/store-workspaces'
import Link from 'next/link'
import { useAudio } from './audio'
import AudioInput from '@/app/components/AudioInput'

type Props = {
    onClick(): void
    dropdown: React.ReactNode
    active: [boolean, (active: boolean) => void]
}

export default function Header({
    onClick,
    dropdown,
    active: [opened, setOpened],
}: Props) {
    const { workspace: workspaceId } = useParams<{ workspace: string }>()
    const [title, setTitle] = useState('Loading...')
    const [workspaceRef, setWorkspaceRef] = useState<Workspace | null>(null)

    const inputFileRef = useRef<HTMLInputElement>(null)
    const audio = useAudio()

    const workspaces = useWorkspaces((state) => state.workspaces)
    const updateWorkspace = useWorkspaces((state) => state.actions.update)

    useEffect(() => {
        const workspace = workspaces.find((w) => w.shorthand_id === workspaceId)
        if (!workspace) return setWorkspaceRef(null)
        setTitle(workspace.title)
        setWorkspaceRef(workspace)

        const onMousedown = (e: MouseEvent) => {
            const rolldown = (ht: HTMLElement | null) => {
                if (!ht) return false
                if (
                    ht.id == 'headerDropdownWrapper' ||
                    ht.id == 'headerDropdownParent'
                )
                    return true
                return rolldown(ht.parentElement)
            }

            if (!rolldown(e.target as HTMLElement) && opened) setOpened(false)
        }

        document.addEventListener('mousedown', onMousedown)

        return () => {
            document.removeEventListener('mousedown', onMousedown)
        }
    }, [workspaces, workspaceId, opened, setOpened])

    return (
        <div className="flex bg-bg-1">
            <Link
                className="flex hover:bg-bg-3 justify-center min-w-[60px] grow"
                href={'/workspaces'}
            ></Link>
            <div className="flex justify-center items-center w-full min-h-[40px] gap-[15px]">
                <AudioInput
                    innerRef={inputFileRef}
                    onChange={(audioBlob, cover) => {
                        audio.src = URL.createObjectURL(audioBlob)
                        const workspace = workspaces.find(
                            (w) => w.shorthand_id === workspaceId
                        )

                        if (!workspace) return

                        let obj
                        if (cover)
                            obj = {
                                ...workspace,
                                fileblob: audioBlob,
                                coverblob: cover,
                            }
                        else
                            obj = {
                                ...workspace,
                                fileblob: audioBlob,
                            }

                        WorkspacesDatabase.update(obj)
                        updateWorkspace(obj)
                    }}
                />
                <div
                    style={{
                        display: audio.duration != 0 ? 'none' : '',
                    }}
                    className="group cursor-pointer"
                >
                    <UploadMusic
                        onClick={() => inputFileRef.current?.click()}
                        className="group-hover:stroke-accent-1 stroke-txt-1 w-[26px] h-[26px]"
                    />
                </div>

                <div
                    onClick={onClick}
                    className="flex cursor-pointer gap-[10px] justify-center items-center"
                    id="headerDropdownParent"
                >
                    <span className="text-txt-2 text-[20px]">
                        {workspaceRef != null ? title : 'Select Workspace'}
                    </span>
                    <IconCarrot className="stroke-txt-2 w-[14px] h-[14px]" />
                </div>
                {dropdown}
            </div>
            <div className="flex justify-center min-w-[60px]"></div>
        </div>
    )
}
