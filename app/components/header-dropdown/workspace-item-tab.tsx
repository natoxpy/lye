import LeftArrowIcon from '@/app/components/icons/leftArrow'
import UploadIcon from '@/app/components/icons/upload'
import { forwardRef } from 'react'

const WorkspaceItemTab = forwardRef<
    HTMLDivElement,
    { prevPage: () => void; nextPage: () => void }
>((props, ref) => {
    return (
        <div
            ref={ref}
            className="flex flex-col w-[300px] h-fit p-[15px] rounded-lg gap-[10px]"
        >
            <div className="flex items-center justify-between px-[10px]">
                <div className="flex items-center justify-start gap-[10px]">
                    <div
                        onClick={props.prevPage}
                        className="cursor-pointer text-txt-1 hover:text-txt-2"
                    >
                        <LeftArrowIcon />
                    </div>
                    <span className="text-txt-2 text-[18px]">Iron Lotus</span>
                </div>
                <div
                    onClick={props.nextPage}
                    className="cursor-pointer text-txt-1 hover:text-txt-2"
                >
                    <UploadIcon className="w-[20px] h-[20px] stroke-txt-1" />
                </div>
            </div>
            <div className="px-[10px]">
                <div className="flex h-[45px]">
                    <div className="flex items-center justify-end min-w-[60px] px-[5px]">
                        <span className="text-txt-2 text-[14px] font-semibold">
                            Artist
                        </span>
                    </div>
                    <div className="flex items-center px-[10px]">
                        <input className="text-txt-2 flex text-[14px] w-full h-[24px] border-b-[1px] border-bg-5 bg-transparent outline-none" />
                    </div>
                </div>

                <div className="flex h-[45px]">
                    <div className="flex items-center justify-end min-w-[60px] px-[5px]">
                        <span className="text-txt-2 text-[14px] font-semibold">
                            Album
                        </span>
                    </div>
                    <div className="flex items-center px-[10px]">
                        <input className="text-txt-2 flex text-[14px] w-full h-[24px] border-b-[1px] border-bg-5 bg-transparent outline-none" />
                    </div>
                </div>

                <div className="flex">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
})

WorkspaceItemTab.displayName = 'WorkspaceItemTab'
export default WorkspaceItemTab
