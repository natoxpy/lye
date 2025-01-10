import AddFile from './addFile'
import Carrot from './carrot'
import Check from './check'
import DownArrow from './downArrow'
import EditLyrics from './editLyrics'
import EyeClose from './eyeClose'
import EyeOpen from './eyeOpen'
import File from './file'
import Folder from './folder'
import FullFile from './fullFile'
import Globe from './globe'
import LeftStickArrow from './leftStickArrow'
import Linked from './linked'
import Locked from './locked'
import Pause from './pause'
import Play from './play'
import Playback from './playback'
import Plus from './plus'
import PlusCircle from './plusCircle'
import RightArrowSquare from './rightArrowSquare'
import SyncLines from './syncLines'
import SyncLyrics from './syncLyrics'
import Unlocked from './unlocked'
import VolumeMax from './volumeMax'
import X from './x'

export default function Page() {
    return (
        <div>
            <div className="flex p-12 gap-4">
                <span className="flex flex-col items-center">
                    AddFile
                    <AddFile className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Carrot
                    <Carrot className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Check
                    <Check className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    DownArrow
                    <DownArrow className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    EditLyrics
                    <EditLyrics className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    EyeClose
                    <EyeClose className="w-10 h-10 fill-red-700 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    EyeOpen
                    <EyeOpen className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    File
                    <File className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Folder
                    <Folder className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    FullFile
                    <FullFile className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Globe
                    <Globe className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    LeftStickArrow
                    <LeftStickArrow className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Linked
                    <Linked className="w-10 h-10 stroke-red-700" />
                </span>
            </div>
            <div className="flex p-12 gap-4">
                <span className="flex flex-col items-center">
                    Locked
                    <Locked className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Pause
                    <Pause className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Play
                    <Play className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Playback
                    <Playback className="w-10 h-10 fill-red-700 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Plus
                    <Plus className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    PlusCircle
                    <PlusCircle className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    SyncLines
                    <SyncLines className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    RightArrowSquare
                    <RightArrowSquare className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    SyncLyrics
                    <SyncLyrics className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    Unlocked
                    <Unlocked className="w-10 h-10 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    VolumeMax
                    <VolumeMax className="w-10 h-10 fill-red-700 stroke-red-700" />
                </span>
                <span className="flex flex-col items-center">
                    X
                    <X className="w-10 h-10 stroke-red-700" />
                </span>
            </div>
        </div>
    )
}
