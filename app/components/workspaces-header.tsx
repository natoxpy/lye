'use client'
import IconCarrot from '@/app/components/icons/carrot'
import IconLinked from '@/app/components/icons/linked'
import IconFile from '@/app/components/icons/file'

type Props = { onClick: () => void; dropdown: React.ReactNode }

export default function Header({ onClick, dropdown }: Props) {
    return (
        <div className="flex justify-center items-center w-full min-h-[40px] bg-bg-1 gap-[15px]">
            <IconFile className="stroke-txt-2 w-[18px] h-[18px]" />
            <IconLinked className="stroke-txt-1 w-[18px] h-[18px]" />
            <div
                onClick={onClick}
                className="flex cursor-pointer gap-[10px] justify-center items-center"
            >
                <span className="text-txt-2 text-[20px]">Iron Lotus</span>
                <IconCarrot className="stroke-txt-2 w-[14px] h-[14px]" />
            </div>
            {dropdown}
        </div>
    )
}
