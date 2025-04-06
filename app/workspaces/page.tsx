/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react'
import DownArrow from '../components/icons/downArrow'
import {
    useHeader,
    usePlainLyrics,
    useWorkspaces,
    useWorkspaceUtils,
} from '@/states/hooks'
import { getPlainLyricsCount } from '@/states/store-plain-lyrics'
import { useRouter } from 'next/navigation'
import Header from './@header/page'

function ActiveList() {
    // const deleteWorkspace = useWorkspaces((state) => state.actions.delete)
    const { deleteWorkspace } = useWorkspaceUtils()
    const workspaces = useWorkspaces((state) => state.workspaces)
    const plainLyrics = usePlainLyrics((state) => state.lyrics)
    const router = useRouter()
    const inputFileRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <table className="grow table-fixed">
                <thead>
                    <tr className="h-10 group">
                        <th className="min-w-12 text-start">
                            <span className="flex justify-center text-txt-2">
                                <div className="w-5 h-5 border-2 group-hover:border-txt-3 border-transparent cursor-pointer hover:opacity-100 opacity-50 transition-all rounded-full"></div>
                            </span>
                        </th>

                        <th className="w-1/3 text-start">
                            <span className="text-txt-2">Name</span>
                        </th>
                        <th className="w-1/3 text-start">
                            <span className="text-txt-2">Lines</span>
                        </th>
                        <th className="w-1/3 text-start">
                            <span className="text-txt-2">Synced</span>
                        </th>

                        <th className="text-start">
                            <span className="text-txt-2">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {workspaces.map((workspace, index) => (
                        <tr
                            key={index}
                            className="border-t-2 group transition-all w-12 border-bg-5 h-14 relative items-center"
                        >
                            <td className="flex justify-center items-center w-12 h-14">
                                <div className="w-5 h-5 border-2 group-hover:border-txt-3 border-transparent cursor-pointer hover:opacity-100 opacity-50 transition-all rounded-full"></div>
                            </td>
                            <td>
                                <span
                                    onClick={() => {
                                        router.push(
                                            `/workspaces/${workspace.shorthand_id}/edit`
                                        )
                                    }}
                                    className="text-txt-3 hover:text-txt-2 cursor-pointer transition-all"
                                >
                                    {workspace.title}
                                </span>
                            </td>
                            <td>
                                <span className="text-txt-3 whitespace-nowrap">
                                    {getPlainLyricsCount(
                                        plainLyrics.find(
                                            (pl) =>
                                                pl.workspace ==
                                                workspace.shorthand_id
                                        )?.content ?? ''
                                    )}
                                </span>
                            </td>
                            <td>
                                <span className="text-txt-3 whitespace-nowrap">
                                    {'N\\A'}
                                </span>
                            </td>

                            <td className="pr-4">
                                <div className="flex items-center gap-4 w-full h-full">
                                    <input
                                        ref={inputFileRef}
                                        type="file"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const getAudioArrayBuffer =
                                                async (): Promise<ArrayBuffer> => {
                                                    return new Promise(
                                                        (res, rej) => {
                                                            const file =
                                                                Array.from(
                                                                    e.target
                                                                        .files ??
                                                                        []
                                                                )[0]
                                                            if (
                                                                !file ||
                                                                (file &&
                                                                    !file.type.startsWith(
                                                                        'audio/'
                                                                    ))
                                                            )
                                                                return
                                                            const n =
                                                                new FileReader()
                                                            n.readAsArrayBuffer(
                                                                file
                                                            )

                                                            n.onload = () =>
                                                                res(
                                                                    n.result as ArrayBuffer
                                                                )
                                                            n.onerror = () =>
                                                                rej(n.error)
                                                        }
                                                    )
                                                }

                                            const getAudioPicture = async (
                                                arrayBuffer: ArrayBuffer
                                            ): Promise<ArrayBuffer> => {
                                                const blob = new Blob([
                                                    arrayBuffer,
                                                ])

                                                return new Promise(
                                                    (res, rej) => {
                                                        new 
                                                        (
                                                            window as any
                                                        ).jsmediatags.read(
                                                            blob,
                                                            {
                                                                onSuccess: (
                                                                    tag: any
                                                                ) => {
                                                                    const picture =
                                                                        tag
                                                                            .tags[
                                                                            'picture'
                                                                        ]
                                                                    if (
                                                                        !picture
                                                                    )
                                                                        return
                                                                    res(
                                                                        new Uint8Array(
                                                                            picture.data
                                                                        ).buffer
                                                                    )
                                                                },
                                                                onError: (
                                                                    error: never
                                                                ) => rej(error),
                                                            }
                                                        )
                                                    }
                                                )
                                            }

                                            const audiobuffer =
                                                await getAudioArrayBuffer()
                                            const picturebuffer =
                                                await getAudioPicture(
                                                    audiobuffer
                                                )

                                            const audioBlob = new Blob([
                                                audiobuffer,
                                            ])
                                            const audioCoverBlob = new Blob([
                                                picturebuffer,
                                            ])

                                            // updateWorkspace({
                                            //     ...workspace,
                                            //     fileblob: audioBlob,
                                            //     coverblob: audioCoverBlob,
                                            // })
                                        }}
                                    />

                                    <button
                                        onClick={() =>
                                            inputFileRef?.current?.click()
                                        }
                                        className="group/assign-audio"
                                    >
                                        <span className="text-txt-3 group-hover/assign-audio:text-txt-2">
                                            AssignAudio
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            deleteWorkspace(
                                                workspace.id,
                                                workspace.shorthand_id
                                            )
                                        }}
                                        className="group/delete-btn"
                                    >
                                        <span className="text-txt-3 group-hover/delete-btn:text-txt-2">
                                            Delete
                                        </span>
                                    </button>

                                    <span className="text-txt-3">
                                        UploadLyrics
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

/*
function ProcessingList({
    data,
}: {
    data: {
        title: string
        targets: string[]
        status: string
    }[]
}) {
    return (
        <>
            <table className="grow table-fixed">
                <thead>
                    <tr className="h-10 group">
                        <th className="min-w-12 text-start">
                            <span className="flex justify-center text-txt-2">
                                <div className="w-5 h-5 border-2 group-hover:border-txt-3 border-transparent transition-all rounded-full"></div>
                            </span>
                        </th>

                        <th className="w-1/3 text-start">
                            <span className="text-txt-2">Name</span>
                        </th>
                        <th className="w-1/3 text-start">
                            <span className="text-txt-2">Targets</span>
                        </th>
                        <th className="w-1/3 text-start">
                            <span className="text-txt-2">Status</span>
                        </th>

                        <th className="text-start">
                            <span className="text-txt-2">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value, index) => (
                        <tr
                            key={index}
                            className="border-t-2 group transition-all cursor-pointer w-12 border-bg-5 h-14 relative items-center"
                            onClick={() => {
                                console.log(2)
                            }}
                        >
                            <td className="flex justify-center items-center w-12 h-14">
                                <div className="w-5 h-5 border-2 group-hover:border-txt-3 border-transparent transition-all rounded-full"></div>
                            </td>
                            <td>
                                <span className="text-txt-3">
                                    {value.title}
                                </span>
                            </td>
                            <td>
                                <span className="text-txt-3 whitespace-nowrap">
                                    {value.targets.join(',')}
                                </span>
                            </td>

                            <td>
                                <span className="text-txt-3 whitespace-nowrap">
                                    {value.status}
                                </span>
                            </td>

                            <td className="pr-4">
                                <div className="flex items-center gap-4 w-full h-full">
                                    <span className="text-txt-3">Cancel</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
*/

function CreateNewButton() {
    const [opened, setOpened] = useState(false)
    const { createEmptyWorkspace, createWorkspace } = useWorkspaceUtils()

    useEffect(() => {
        const onMousedown = (e: MouseEvent) => {
            const rolldown = (ht: HTMLElement | null) => {
                if (!ht) return false
                if (ht.id == 'CreateNewButton') return true
                return rolldown(ht.parentElement)
            }

            if (!rolldown(e.target as HTMLElement) && opened) setOpened(false)
        }

        document.addEventListener('mousedown', onMousedown)

        return () => {
            document.removeEventListener('mousedown', onMousedown)
        }
    })

    return (
        <div
            id="CreateNewButton"
            style={{
                background: opened ? 'var(--color-bg-5)' : '',
            }}
            className="relative cursor-pointer hover:bg-bg-5 transition-all bg-bg-4 rounded-md"
        >
            <button
                onClick={() => {
                    setOpened((o) => !o)
                }}
                className="flex gap-1 justify-center items-center px-4 py-2"
            >
                <span className="text-txt-2">Create New</span>
                <DownArrow width={20} stroke="var(--color-txt-2)" />
            </button>

            <div
                style={{
                    transformOrigin: 'top',
                    transform: opened ? 'scale(1)' : 'scale(0.8)',
                    opacity: opened ? 1 : 0,
                    pointerEvents: opened ? 'visiblePainted' : 'none',
                }}
                className="flex flex-col transition-all absolute top-12 left-0 overflow-hidden w-full bg-bg-3 border-2 border-bg-4 rounded-md z-[20]"
            >
                <button
                    onClick={() => {
                        setOpened(false)
                        createEmptyWorkspace()
                    }}
                    className="relative text-left cursor-pointer hover:bg-bg-4 transition-all px-4 py-2"
                >
                    <span className="text-txt-2">Empty</span>
                </button>

                <button
                    onClick={async () => {
                        const url = prompt('Genius link')

                        setOpened(false)

                        if (
                            url == null ||
                            url.startsWith('https://genius.com') == false
                        )
                            return

                        const response = await fetch(
                            `/api/genius?url=${decodeURI(url)}`
                        )

                        if (response.status == 400) {
                            alert(`${url} was not found`)
                            return
                        }

                        const song = (await response.json()) as {
                            title: string
                            album: string
                            artist: string
                            lyrics: string
                        }

                        createWorkspace({
                            workspace: {
                                title: song.title,
                                album: song.album,
                                artist: song.artist,
                            },
                            plainLyrics: song.lyrics,
                        })
                    }}
                    className="relative text-left cursor-pointer hover:bg-bg-4 transition-all px-4 py-2"
                >
                    <span className="text-txt-2">From Genius</span>
                </button>

                <button className="relative text-left transition-all cursor-default px-4 py-2 opacity-50">
                    <span className="text-txt-2">From LUR</span>
                </button>

                <button className="relative text-left transition-all cursor-default px-4 py-2 opacity-50">
                    <span className="text-txt-2">From LRCLIB</span>
                </button>
            </div>
        </div>
    )
}

export default function Page() {
    const header = useHeader((state) => state.actions)
    useEffect(() => {
        header.setTab(0)
    })

    return (
        <div className="flex flex-col w-screen max-h-screen h-screen bg-bg-2">
            <Header />
            <div className="flex justify-center pt-10">
                <div className="flex flex-col grow max-w-[1480px] mx-20 gap-3">
                    <div className="flex justify-between w-full rounded-lg">
                        <div className="flex gap-3">
                            <input
                                placeholder="Filter"
                                className="w-52 px-3 bg-bg-3 outline-none text-txt-2 rounded-md border-2 border-transparent transition-all focus:border-bg-5"
                            />

                            <div className="flex rounded-md overflow-hidden">
                                <div className="text-txt-2 bg-bg-3 hover:bg-bg-4 px-4 py-2 cursor-pointer select-none">
                                    Active
                                </div>
                                <div className="text-txt-3 bg-bg-2 hover:bg-bg-4 cursor-pointer px-4 py-2 select-none">
                                    Processing
                                </div>
                                <div className="bg-bg-2 hover:bg-bg-4 cursor-pointer px-4 py-2 text-txt-3 select-none">
                                    Finished
                                </div>
                            </div>
                        </div>

                        <CreateNewButton />
                    </div>
                    <div className="px-6 py-4 text-[18px] rounded-lg bg-bg-3">
                        <ActiveList />
                    </div>

                    <div className="flex justify-between w-full">
                        <div className="px-5 py-1 rounded-lg bg-bg-3">
                            <div className="flex items-center justify-center h-full">
                                <span className="text-txt-2">1 of 1</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="px-3 border-bg-5 rounded-lg bg-bg-3 opacity-50">
                                <button className="px-4 py-2 rounded-md">
                                    <DownArrow
                                        stroke="var(--color-txt-2)"
                                        style={{
                                            transform: 'rotate(90deg)',
                                        }}
                                    />
                                </button>
                            </div>

                            <div className="px-3 border-bg-5 rounded-lg bg-bg-3 opacity-50">
                                <button className="px-4 py-2 rounded-md">
                                    <DownArrow
                                        stroke="var(--color-txt-2)"
                                        style={{
                                            transform: 'rotate(-90deg)',
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
