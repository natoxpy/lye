import FolderIcon from '@/app/components/icons/folder'

export default function Page() {
    return (
        <div className="flex grow max-w-[60px] bg-bg-3">
            <div className="min-w-[60px] max-w-[60px] h-full bg-bg-2">
                <div className="flex bg-bg-3 border-r-[1px] opacity-35 border-bg-2 justify-center items-center w-full h-[50px]">
                    <FolderIcon className="stroke-txt-2" />
                </div>
            </div>
        </div>
    )
}
