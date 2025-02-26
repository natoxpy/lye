'use client'
import IconCarrot from '@/app/components/icons/carrot'
import IconLinked from '@/app/components/icons/linked'
import IconFile from '@/app/components/icons/file'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useWorkspaces } from '@/states/hooks'

type Props = { onClick: () => void; dropdown: React.ReactNode }

export default function Header({ onClick, dropdown }: Props) {
    const { workspace: workspaceId } = useParams<{ workspace: string }>()
    const [title, setTitle] = useState('Loading...')

    const workspaces = useWorkspaces((state) => state.workspaces)

    useEffect(() => {
        const workspace = workspaces.find((w) => w.shorthand_id === workspaceId)
        if (!workspace) return
        setTitle(workspace.title)
    }, [workspaces, workspaceId])

    return (
        <div className="flex justify-center items-center w-full min-h-[40px] bg-bg-1 gap-[15px]">
            <IconFile className="stroke-txt-2 w-[18px] h-[18px]" />
            <IconLinked className="stroke-txt-1 w-[18px] h-[18px]" />
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
