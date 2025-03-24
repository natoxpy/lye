'use client'
import IconCarrot from '@/app/components/icons/carrot'
// import IconLinked from '@/app/components/icons/linked'
import IconFile from '@/app/components/icons/file'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useWorkspaces } from '@/states/hooks'
import { updateWorkspace } from '@/states/persistance'
import { Workspace } from '@/states/store-workspaces'
// import jsmediatags from 'jsmediatags'

type Props = { onClick: () => void; dropdown: React.ReactNode }

export default function Header({ onClick, dropdown }: Props) {
    const { workspace: workspaceId } = useParams<{ workspace: string }>()
    const [title, setTitle] = useState('Loading...')
    const [workspaceRef, setWorkspaceRef] = useState<Workspace | null>(null)

    const inputFileRef = useRef<HTMLInputElement>(null)

    const workspaces = useWorkspaces((state) => state.workspaces)

    useEffect(() => {
        const workspace = workspaces.find((w) => w.shorthand_id === workspaceId)
        if (!workspace) return
        setTitle(workspace.title)
        setWorkspaceRef(workspace)
    }, [workspaces, workspaceId])

    return (
        <div className="flex justify-center items-center w-full min-h-[40px] bg-bg-1 gap-[15px]">
            <input
                onChange={async (e) => {
                    const getAudioArrayBuffer =
                        async (): Promise<ArrayBuffer> => {
                            return new Promise((res, rej) => {
                                const file = Array.from(e.target.files ?? [])[0]
                                if (
                                    !file ||
                                    (file && !file.type.startsWith('audio/'))
                                )
                                    return
                                const n = new FileReader()
                                n.readAsArrayBuffer(file)

                                n.onload = () => res(n.result as ArrayBuffer)
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
            <div className="group cursor-pointer">
                <IconFile
                    onClick={() => inputFileRef.current?.click()}
                    style={{
                        stroke: workspaceRef?.fileblob
                            ? 'var(--color-txt-2)'
                            : '#f87171',
                    }}
                    className="group-hover:opacity-50 w-[18px] h-[18px]"
                />
            </div>

            <div
                onClick={onClick}
                className="flex cursor-pointer gap-[10px] justify-center items-center"
            >
                <span className="text-txt-2 text-[20px]">{title}</span>
                <IconCarrot className="stroke-txt-2 w-[14px] h-[14px]" />
            </div>
            {dropdown}
        </div>
    )
}
