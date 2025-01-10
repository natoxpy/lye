'use client'
import IconCarrot from '@/app/components/icons/carrot'
import IconLinked from '@/app/components/icons/linked'
import IconFile from '@/app/components/icons/file'
import { useCallback, useRef, useState } from 'react'

type Props = { dropdown: React.ReactNode }

export default function Header({ dropdown }: Props) {
    const [dropdownToggled, setDropdownToggled] = useState(true)
    const childElement = useRef<HTMLDivElement>(null)

    const getMaxHeight = useCallback(() => {
        return childElement.current?.getBoundingClientRect().height
    }, [childElement])

    return (
        <div className="flex justify-center items-center w-full min-h-[40px] bg-bg-1 gap-[15px]">
            <IconFile className="stroke-txt-2 w-[18px] h-[18px]" />
            <IconLinked className="stroke-txt-1 w-[18px] h-[18px]" />
            <div
                onClick={() => setDropdownToggled((t) => !t)}
                className="flex cursor-pointer gap-[10px] justify-center items-center"
            >
                <span className="text-txt-2 text-[20px]">Iron Lotus</span>
                <IconCarrot className="stroke-txt-2 w-[14px] h-[14px]" />
            </div>
            <div
                style={{
                    maxHeight: !dropdownToggled
                        ? (getMaxHeight(), '0px')
                        : getMaxHeight(),
                }}
                className="z-30 absolute left-1/2 overflow-hidden -translate-x-1/2 text-white top-12 transition-all ease-in-out shadow-xl"
            >
                <div ref={childElement}>{dropdown}</div>
            </div>
        </div>
    )
}
