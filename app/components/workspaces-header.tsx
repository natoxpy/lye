'use client'
import IconCarrot from '@/app/components/icons/carrot'
import UploadMusic from '@/app/components/icons/uploadMusic'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useWorkspaces } from '@/states/hooks'
import { updateWorkspace } from '@/states/persistance'
import { Workspace } from '@/states/store-workspaces'
import Link from 'next/link'
import { useAudio } from './audio'

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
                <input
                    onChange={async (e) => {
                        const getAudioArrayBuffer =
                            async (): Promise<ArrayBuffer> => {
                                return new Promise((res, rej) => {
                                    const file = Array.from(
                                        e.target.files ?? []
                                    )[0]
                                    if (
                                        !file ||
                                        (file &&
                                            !file.type.startsWith('audio/'))
                                    )
                                        return
                                    const n = new FileReader()
                                    n.readAsArrayBuffer(file)

                                    n.onload = () =>
                                        res(n.result as ArrayBuffer)
                                    n.onerror = () => rej(n.error)
                                })
                            }

                        const getAudioPicture = async (
                            arrayBuffer: ArrayBuffer
                        ): Promise<ArrayBuffer> => {
                            const blob = new Blob([arrayBuffer])

                            return new Promise((res, rej) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                new (window as any).jsmediatags.read(blob, {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onSuccess: (tag: any) => {
                                        const picture = tag.tags['picture']
                                        if (!picture) return
                                        res(new Uint8Array(picture.data).buffer)
                                    },
                                    onError: (error: never) => rej(error),
                                })
                            })
                        }

                        const audiobuffer = await getAudioArrayBuffer()
                        const picturebuffer = await getAudioPicture(audiobuffer)

                        const audioBlob = new Blob([audiobuffer])
                        const audioCoverBlob = new Blob([picturebuffer])

                        audio.src = URL.createObjectURL(audioBlob)

                        const workspace = workspaces.find(
                            (w) => w.shorthand_id === workspaceId
                        )
                        if (!workspace) return

                        updateWorkspace({
                            ...workspace,
                            fileblob: audioBlob,
                            coverblob: audioCoverBlob,
                        })
                    }}
                    ref={inputFileRef}
                    type="file"
                    className="hidden"
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
