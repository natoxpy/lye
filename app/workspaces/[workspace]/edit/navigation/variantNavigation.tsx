'use client'
import AddFileIcon from '@/app/icons/addFile'
import FullFileIcon from '@/app/icons/fullFile'
import GlobeIcon from '@/app/icons/globe'
import XIcon from '@/app/icons/x'
import PlusIcon from '@/app/icons/plus'
import Scrollable from './scrollable'
import CheckIcon from '@/app/icons/check'
import iso6391 from 'iso-639-1'
import MiniSearch from 'minisearch'
import Style from './variantNav.module.scss'
import Link from 'next/link'
import {
    KeyboardEventHandler,
    MouseEventHandler,
    useEffect,
    useRef,
    useState as useReactState,
} from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    createVariant,
    deleteVariant,
    editVariant,
    setVariantLanguages,
    setVariantName,
    useVariants,
} from '@/store/stores/lyrics'

function VariantItem({
    name,
    languages,
    id,
}: {
    name: string
    languages: string[]
    id: string
    ondbClick?: MouseEventHandler<HTMLDivElement>
}) {
    const { workspace, variant } = useParams<{
        workspace: string
        variant?: string
    }>()
    const dispatch = useAppDispatch()

    const OpenLanguageEditor = () =>
        dispatch(
            editVariant({
                workspaceId: workspace,
                variantId: id,
                editing: 'languages',
            })
        )

    const OpenNameEditor = () =>
        dispatch(
            editVariant({
                workspaceId: workspace,
                variantId: id,
                editing: 'name',
            })
        )

    return (
        <Link
            tabIndex={0}
            aria-label="Language Variant Item"
            role="menuitem"
            href={`/workspaces/main/edit/${id}`}
            style={{
                backgroundColor:
                    variant == id ? 'hsla(var(--color-bg-6-hsl), 0.4)' : '',
            }}
            className="w-full px-[20px] group outline-none flex items-center h-[50px] focus:bg-bg-4 hover:bg-bg-4 cursor-pointer"
            onDoubleClick={() => {
                OpenNameEditor()
            }}
            onKeyDown={(e) => {
                if (e.key == 'F2') OpenNameEditor()
                else if (e.key == 'Delete') {
                    dispatch(
                        deleteVariant({
                            workspaceId: workspace,
                            variantId: id,
                        })
                    )
                }
            }}
        >
            <div className="flex justify-center items-center">
                <FullFileIcon className="stroke-txt-1" />
            </div>

            <div className="w-full flex items-center px-[4px] gap-[3px]">
                <div className="flex grow-[2]">
                    {name.trim() !== '' ? (
                        <span className="select-none w-full max-w-[150px] overflow-hidden text-ellipsis text-txt-2 text-[12px] whitespace-nowrap">
                            {name}
                        </span>
                    ) : (
                        <span className="text-txt-1 italic text-[12px]">
                            Nameless
                        </span>
                    )}
                </div>

                <div
                    tabIndex={0}
                    className="w-fit outline-none hover:border-txt-1 focus:border-accent-1 border-[2px] border-transparent rounded-full flex justify-end group/language"
                    onClick={(e) => {
                        e.preventDefault()
                        OpenLanguageEditor()
                    }}
                    onKeyDown={(e) => {
                        if (e.key == ' ' || e.key == 'Enter') {
                            e.preventDefault()
                            OpenLanguageEditor()
                        }
                    }}
                >
                    <span className="select-none w-full max-w-[50px] whitespace-nowrap overflow-hidden text-ellipsis group-hover:hidden group-focus:hidden group-focus/language:hidden block text-txt-1 text-[12px] text-end">
                        {languages.join(', ')}
                    </span>

                    <div className="group-focus:flex group-hover:flex group-focus/language:flex hidden items-center justify-end">
                        <GlobeIcon className="group-hover/language:stroke-txt-2 group-focus/language:stroke-txt-2 stroke-txt-1" />
                    </div>
                </div>
            </div>
        </Link>
    )
}

function LanguageEditor({ variantId }: { variantId: string }) {
    const { workspace } = useParams<{ workspace: string }>()
    const variants = useAppSelector(useVariants(workspace))
    const dispatch = useAppDispatch()

    const variant = variants.find((item) => item.id === variantId)!
    const inputRef = useRef<HTMLInputElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useReactState('')
    const [languageCursor, setLanguageCursor] = useReactState<null | number>(
        null
    )
    const [keys, setKeys] = useReactState<{ shift: boolean }>({ shift: false })
    const numberOfResults = 1

    const [results, setResults] = useReactState<
        Array<{ code: string; nativeName: string }>
    >([])

    const [minisearch] = useReactState(
        new MiniSearch({
            idField: 'code',
            fields: ['name', 'nativeName'],
            storeFields: ['code', 'nativeName'],
            searchOptions: {
                boost: { name: 2 },
                fuzzy: 0.2,
            },
        })
    )

    useEffect(() => {
        const fields = iso6391.getAllCodes().map((code) => ({
            code,
            name: iso6391.getName(code),
            nativeName: iso6391.getNativeName(code),
        }))

        minisearch.removeAll()
        minisearch.addAll(fields)
    }, [minisearch])

    const SelectedLanguage = ({
        name,
        onTrigger,
        selected,
    }: {
        name: string
        selected?: boolean
        onTrigger: () => void
    }) => {
        const optionElement = useRef<HTMLDivElement>(null)
        useEffect(() => {
            const keydown = (e: KeyboardEvent) => {
                if (selected !== true) return
                if (e.key == 'Enter') onTrigger()
            }
            document.addEventListener('keydown', keydown)
            return () => document.removeEventListener('keydown', keydown)
        })

        useEffect(() => {
            if (selected !== true) return

            const element = optionElement.current
            if (!element) return
            const parent = element.parentElement
            if (parent == null) return
            const height = parent.getBoundingClientRect().height
            const offsetTop =
                element.offsetTop -
                height / 2 +
                element.getBoundingClientRect().height / 2

            parent.scrollTo(0, offsetTop)
        }, [optionElement, selected])

        return (
            <div
                ref={optionElement}
                tabIndex={-1}
                role="option"
                className={`${Style.selectedLanguageRemoveOption} group/g1 outline-none border-l-[1px] border-transparent focus:bg-bg-4 focus:accent-red hover:border-accent-red hover:bg-bg-4 flex items-center w-full min-h-[35px] h-full px-[10px] gap-[5px]`}
                aria-selected={selected}
                onClick={() => onTrigger()}
            >
                <CheckIcon
                    className={`${Style.removeIconCheck} group-hover/g1:hidden group-focus/g1:hidden w-[8px] h-[6px] stroke-txt-2`}
                />
                <XIcon
                    className={`${Style.removeIcon} group-hover/g1:flex group-focus/g1:flex hidden w-[8px] h-[8px] stroke-accent-red`}
                />
                <span className="select-none text-txt-2 text-[12px]">
                    {name}
                </span>
            </div>
        )
    }

    const SearchResultLanguage = ({
        name,
        onTrigger,
        selected,
    }: {
        name: string
        onTrigger: () => void
        selected?: boolean
    }) => {
        useEffect(() => {
            const keydown = (e: KeyboardEvent) => {
                if (selected !== true) return
                if (e.key == 'Enter') onTrigger()
            }
            document.addEventListener('keydown', keydown)
            return () => document.removeEventListener('keydown', keydown)
        })

        return (
            <div
                tabIndex={-1}
                role="option"
                className={`${Style.selectedLanguageAddOption} group/g1 outline-none border-l-[1px] border-transparent focus:bg-bg-4 focus:accent-green hover:border-accent-green hover:bg-bg-4 flex items-center w-full min-h-[35px] h-full px-[10px] gap-[5px]`}
                aria-selected={selected}
                onClick={() => onTrigger()}
                onKeyDown={(e) => (e.key == 'Enter' ? onTrigger() : '')}
            >
                <CheckIcon
                    className={`${Style.addIconCheck} group-hover/g1:hidden group-focus/g1:hidden flex w-[8px] h-[6px] stroke-transparent`}
                />
                <PlusIcon
                    className={`${Style.addIcon} group-hover/g1:flex group-focus/g1:flex hidden w-[8px] h-[8px] stroke-accent-green add-icon`}
                />
                <span className="select-none text-txt-2 text-[12px]">
                    {name}
                </span>
            </div>
        )
    }

    const SearchResultLanguageEmpty = () => (
        <div
            role="menuitem"
            className={`outline-none flex items-center w-full min-h-[35px] h-full`}
        >
            <div
                className={`border-2 border-bg-3 rounded-[3px] w-full min-h-[35px] h-full ${Style.emptyItemStripes}`}
            ></div>
        </div>
    )

    const Close = () => {
        dispatch(
            editVariant({
                workspaceId: workspace,
                variantId,
            })
        )
    }

    const inputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        const moveUp = () =>
            setLanguageCursor((cursor) => {
                if (cursor == undefined || cursor - 1 <= 0) return 0
                return cursor - 1
            })

        const moveDown = () =>
            setLanguageCursor((cursor) => {
                if (cursor == undefined) return 0
                const max = results.length + variant.languages.length

                if (cursor + 1 >= max) return max - 1
                return cursor + 1
            })

        switch (e.key) {
            case 'Enter':
                setTimeout(() => setValue(''))

                break
            case 'Escape':
                Close()
                break
            case 'Tab':
                e.preventDefault()
                if (keys.shift) moveUp()
                else moveDown()

                break
            case 'ArrowUp':
                e.preventDefault()
                moveUp()

                break
            case 'ArrowDown':
                e.preventDefault()
                moveDown()
                break
        }
    }

    useEffect(() => {
        if (inputRef.current == undefined) return
        inputRef.current.focus()
    }, [inputRef])

    useEffect(() => {
        if (!rootRef.current) return
        const element = rootRef.current

        const onpress = (e: MouseEvent) => {
            if (!element.contains(e.target as HTMLDivElement)) Close()
        }

        const keyup = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Shift':
                    setKeys(() => ({
                        shift: false,
                    }))
                    break
            }
        }
        const keydown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Shift':
                    setKeys(() => ({
                        shift: true,
                    }))
                    break
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Tab':
                    break

                default:
                    inputRef.current?.focus()
                    break
            }
        }

        document.addEventListener('keyup', keyup)
        document.addEventListener('keydown', keydown)
        document.addEventListener('mousedown', onpress)
        return () => {
            document.removeEventListener('keyup', keyup)
            document.removeEventListener('keydown', keydown)
            document.removeEventListener('mousedown', onpress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rootRef])

    useEffect(() => {
        const variantLangs = new Set(variant.languages.map((lang) => lang.code))
        const miniresults = minisearch
            .search(value, { prefix: true })
            .splice(0, numberOfResults)
            .filter((result) => !variantLangs.has(result['code']))

        setResults(
            miniresults.map((item) => ({
                code: item['code'],
                nativeName: item['nativeName'],
            }))
        )

        if (miniresults.length == 0) setLanguageCursor(null)
        else setLanguageCursor(0)
    }, [value, variant, minisearch, setResults, setLanguageCursor])

    return (
        <div
            ref={rootRef}
            className="w-full absolute bg-bg-3 top-6 left-0 border-[1px] border-bg-5 overflow-hidden rounded-[3px]"
        >
            <div className="flex items-center pl-[12px] bg-bg-4 w-full h-[35px]">
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    role="search"
                    className="bg-transparent outline-none border-none text-txt-2 text-[12px]"
                    placeholder="Language Name"
                    onKeyDown={inputKeyDown}
                    // onFocus={() => setLanguageCursor(0)}
                    onBlur={() => setLanguageCursor(null)}
                />
            </div>

            <div className="w-full h-[2px] bg-bg-5"></div>

            <div
                style={{
                    minHeight: 35 * numberOfResults + 'px',
                }}
                className="flex flex-col w-full"
            >
                {results.map((result, idx) => (
                    <SearchResultLanguage
                        key={result.code}
                        name={result.nativeName}
                        selected={languageCursor == idx}
                        onTrigger={() => {
                            dispatch(
                                setVariantLanguages({
                                    workspaceId: workspace,
                                    variantId,
                                    languages: [result, ...variant.languages],
                                })
                            )
                        }}
                    />
                ))}
                {Array.from({
                    length:
                        numberOfResults - results.length < 0
                            ? 0
                            : numberOfResults - results.length,
                }).map((_, idx) => (
                    <SearchResultLanguageEmpty key={idx} />
                ))}
            </div>

            <div className="w-full h-[2px] bg-bg-5"></div>
            {variant.languages.length == 0 && (
                <div className="flex justify-center w-full">
                    <span className="text-txt-1 text-[12px] py-3">
                        No selected languages
                    </span>
                </div>
            )}

            <Scrollable variant="bg2">
                {variant.languages.map((language, idx) => (
                    <SelectedLanguage
                        key={language.code}
                        name={language.nativeName}
                        selected={
                            languageCursor !== null &&
                            idx == languageCursor - results.length
                        }
                        onTrigger={() => {
                            dispatch(
                                setVariantLanguages({
                                    workspaceId: workspace,
                                    variantId,
                                    languages: variant.languages.filter(
                                        (lang) => lang.code !== language.code
                                    ),
                                })
                            )
                        }}
                    />
                ))}
            </Scrollable>
        </div>
    )
}

function VariantItemLanguageEditor({ variantId }: { variantId: string }) {
    const { workspace } = useParams<{ workspace: string }>()
    const variants = useAppSelector(useVariants(workspace))
    const variant = variants.find((item) => item.id === variantId)!

    return (
        <div
            tabIndex={0}
            aria-label="Language Variant Item Editor"
            role="option"
            aria-selected={true}
            className="w-full px-[20px] group outline-none flex items-center h-[50px] bg-bg-5 cursor-pointer"
        >
            <div className="flex justify-center items-center">
                <FullFileIcon className="stroke-txt-1" />
            </div>

            <div className="relative w-full flex items-center px-[4px] gap-[3px]">
                <div className="flex grow-[2]">
                    <span className="w-full max-w-[150px] overflow-hidden text-ellipsis text-txt-2 text-[12px] whitespace-nowrap">
                        {variant.name}
                    </span>
                </div>

                <div
                    tabIndex={0}
                    className="w-fit flex justify-end border-transparent"
                >
                    <div className="flex items-center justify-end border-[2px] rounded-full border-transparent">
                        <GlobeIcon className="stroke-accent-1" />
                    </div>
                </div>

                <LanguageEditor variantId={variantId} />
            </div>
        </div>
    )
}

function VariantItemNameEditor({ variantId }: { variantId: string }) {
    const { workspace } = useParams<{ workspace: string }>()
    const variants = useAppSelector(useVariants(workspace))
    const dispatch = useAppDispatch()
    const variant = variants.find((item) => item.id == variantId)!
    const inputRef = useRef<HTMLInputElement>(null)

    const Close = () =>
        dispatch(
            editVariant({
                workspaceId: workspace,
                variantId,
            })
        )

    useEffect(() => {
        if (!inputRef.current) return
        inputRef.current.focus()
    }, [inputRef])

    return (
        <div
            tabIndex={0}
            aria-label="Language Variant Item"
            role="menuitem"
            className="w-full px-[20px] group outline-none flex items-center h-[50px] bg-bg-5 cursor-pointer"
        >
            <div className="flex justify-center items-center">
                <FullFileIcon className="stroke-txt-1" />
            </div>

            <div className="w-full flex items-center px-[4px] gap-[3px]">
                <div className="flex grow-[2] border-b-[1px] border-bg-6">
                    <input
                        ref={inputRef}
                        className="w-full outline-none bg-transparent text-[12px] text-txt-2"
                        placeholder="Name"
                        value={variant.name}
                        onBlur={Close}
                        onKeyDown={(e) => {
                            if (e.key == 'Escape' || e.key == 'Enter') Close()
                        }}
                        onChange={(e) =>
                            dispatch(
                                setVariantName({
                                    workspaceId: workspace,
                                    variantId,
                                    name: e.target.value,
                                })
                            )
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default function Navigation() {
    const { workspace } = useParams<{ workspace: string }>()
    const variants = useAppSelector(useVariants(workspace))
    const dispatch = useAppDispatch()

    return (
        <div
            aria-label="Variants"
            role="navigation"
            className="outline-none bg-bg-3 flex flex-col w-[260px]"
        >
            <div className="flex justify-between px-[20px] items-center w-full h-[50px]">
                <span className="select-none text-txt-2 text-[14px]">
                    Variants
                </span>
                <button
                    aria-label="Add variant"
                    tabIndex={0}
                    className="tab-focus group cursor-pointer"
                    onClick={() =>
                        dispatch(
                            createVariant({
                                workspace: workspace,
                                name: '',
                                editing: 'name',
                            })
                        )
                    }
                >
                    <AddFileIcon className="group-hover:stroke-accent-1 stroke-txt-2" />
                </button>
            </div>

            {variants.map((variant) => {
                if (variant.editing == 'languages')
                    return (
                        <VariantItemLanguageEditor
                            variantId={variant.id}
                            key={variant.id}
                        />
                    )
                else if (variant.editing == 'name')
                    return (
                        <VariantItemNameEditor
                            key={variant.id}
                            variantId={variant.id}
                        />
                    )
                else
                    return (
                        <VariantItem
                            key={variant.id}
                            id={variant.id}
                            name={variant.name}
                            languages={variant.languages.map(
                                (l) => l.nativeName
                            )}
                            ondbClick={() =>
                                dispatch(
                                    editVariant({
                                        workspaceId: workspace,
                                        variantId: variant.id,
                                        editing: 'name',
                                    })
                                )
                            }
                        />
                    )
            })}
        </div>
    )
}
