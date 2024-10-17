import IconCarrot from '@/app/icons/carrot'
import IconLinked from '@/app/icons/linked'
import IconFile from '@/app/icons/file'

export default function Header() {
    return (
        <div className="flex justify-center items-center w-full min-h-[40px] bg-bg-1 gap-[15px]">
            <IconFile className="stroke-txt-2" />
            <IconLinked className="stroke-txt-1" />
            <div className="flex gap-[10px] justify-center items-center">
                <span className="text-txt-2 text-[16px]">
                    In Hell We Live, Lament
                </span>
                <IconCarrot className="stroke-txt-2" />
            </div>
        </div>
    )
}
