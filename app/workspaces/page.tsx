/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useRef, useState } from 'react'
import DownArrow from '../components/icons/downArrow'
import AudioInput from '@/app/components/AudioInput'
import {
    useHeader,
    useLineSync,
    useLyrics,
    useWorkspaces,
    useWorkspaceUtils,
} from '@/states/hooks'
import { useRouter } from 'next/navigation'
import Header from './@header/page'
import { WorkspacesDatabase } from '@/states/persistance'
import { getLyricsCount } from '@/states/store-lyrics'
import { getLineSyncCount } from '@/states/store-line-sync'
import { useAudio } from '../components/audio'

function ActiveList() {
    const { deleteWorkspace } = useWorkspaceUtils()
    const workspaces = useWorkspaces((state) => state.workspaces)
    const updateWorkspace = useWorkspaces((state) => state.actions.update)
    const lyrics = useLyrics((state) => state.workspaces)
    const linesyncs = useLineSync((state) => state.workspaces)
    const audio = useAudio()

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
                                    {getLyricsCount(
                                        lyrics.find(
                                            (pl) =>
                                                pl.workspace ==
                                                workspace.shorthand_id
                                        )?.lyrics
                                    )}
                                </span>
                            </td>
                            <td>
                                <span className="text-txt-3 whitespace-nowrap">
                                    {Math.round(
                                        (getLineSyncCount(
                                            lyrics.find(
                                                (pl) =>
                                                    pl.workspace ==
                                                    workspace.shorthand_id
                                            )?.lyrics,
                                            linesyncs.find(
                                                (w) =>
                                                    w.workspace ==
                                                    workspace.shorthand_id
                                            )?.content
                                        ) /
                                            getLyricsCount(
                                                lyrics.find(
                                                    (pl) =>
                                                        pl.workspace ==
                                                        workspace.shorthand_id
                                                )?.lyrics
                                            )) *
                                            100
                                    ) + '%'}
                                </span>
                            </td>

                            <td className="pr-4">
                                <div className="flex items-center gap-4 w-full h-full">
                                    <AudioInput
                                        innerRef={inputFileRef}
                                        onChange={(audioBlob, cover) => {
                                            audio.src =
                                                URL.createObjectURL(audioBlob)

                                            let obj

                                            if (cover != undefined)
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

                                            updateWorkspace(obj)
                                            WorkspacesDatabase.update(obj)
                                        }}
                                    />

                                    {workspace.fileblob == undefined ? (
                                        <button
                                            onClick={() => {
                                                inputFileRef?.current?.click()
                                            }}
                                            className="group/assign-audio"
                                        >
                                            <span className="text-txt-3 whitespace-nowrap group-hover/assign-audio:text-txt-2">
                                                Assign Audio
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                const {
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    fileblob,
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    coverblob,
                                                    ...object
                                                } = workspace

                                                updateWorkspace(object as any)
                                                WorkspacesDatabase.update({
                                                    ...(object as any),
                                                })
                                            }}
                                            className="group/assign-audio"
                                        >
                                            <span className="text-txt-3 whitespace-nowrap group-hover/assign-audio:text-txt-2">
                                                Remove Audio
                                            </span>
                                        </button>
                                    )}

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
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

function CreateNewButton() {
    const [opened, setOpened] = useState(false)
    const { createEmptyWorkspace } = useWorkspaceUtils()

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
            </div>
        </div>
    )
}

export default function Page() {
    const header = useHeader((state) => state.actions)
    useEffect(() => {
        header.setActive(false)
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
