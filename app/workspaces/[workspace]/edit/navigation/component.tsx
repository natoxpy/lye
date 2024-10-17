import FolderIcon from '@/app/icons/folder'
import VariantNavigation from './variantNavigation'

export default function Component() {
    return (
        <div className="flex min-w-[320px] max-w-[320px] bg-bg-3">
            <div className="min-w-[60px] max-w-[60px] h-full bg-bg-2">
                <div className="flex bg-bg-3 border-r-[1px] border-bg-2 justify-center items-center w-full h-[50px]">
                    <FolderIcon className="stroke-txt-2" />
                </div>
            </div>

            <VariantNavigation />
        </div>
    )
}
