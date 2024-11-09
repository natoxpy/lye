import { PayloadAction } from '@reduxjs/toolkit'
import { Line, LinesSync, State } from '../reducer'
import * as Diff from 'diff'
import { cyrb53 } from '@/app/utils/hash'
import { HEADER_INITIAL } from '..'

class DiffItem {
    constructor(
        public content: string,
        public line: number,
        public newline: number,
        public type: string
    ) {}
}

class Header extends DiffItem {
    constructor(content: string, line: number, newline: number) {
        super(content, line, newline, 'header')
    }
}
class Consistent extends DiffItem {
    constructor(content: string, line: number, newline: number) {
        super(content, line, newline, 'consistent')
    }
}
class Removed extends DiffItem {
    constructor(content: string, line: number, newline: number) {
        super(content, line, newline, 'removed')
    }
}
class Added extends DiffItem {
    constructor(content: string, line: number, newline: number) {
        super(content, line, newline, 'added')
    }
}
class Updated extends DiffItem {
    constructor(
        public original: string,
        content: string,
        line: number,
        newline: number
    ) {
        super(content, line, newline, 'updated')
    }
}

class Diffing {
    diff: Diff.ArrayChange<string>[]
    result: Array<DiffItem>
    line: number = 0
    removedLine: number = 0
    addedLine: number = 0
    headerLine: number = 0
    skipCount: number = 0

    constructor(
        public preLines: string[],
        public newLines: string[]
    ) {
        this.diff = Diff.diffArrays(preLines, newLines)
        this.result = []
    }

    public computeLine(key = 0) {
        return key + this.line
    }

    public computeNewLine(key = 0, postComputeCB?: () => void) {
        const value =
            key +
            this.line -
            this.removedLine +
            this.addedLine -
            this.headerLine

        if (postComputeCB) postComputeCB()
        return value
    }

    consistent(item: Diff.ArrayChange<string>) {
        if (item.removed || item.added) return 0

        this.result.push(
            ...item.value.map((i, key) => {
                if (i.startsWith(HEADER_INITIAL)) {
                    return new Header(
                        i,
                        this.computeLine(key),
                        this.computeNewLine(key, () => this.headerLine++)
                    )
                }

                return new Consistent(
                    i,
                    this.computeLine(key),
                    this.computeNewLine(key)
                )
            })
        )

        this.line += item.value.length

        return 1
    }

    updatedMap(original?: string, content?: string, key: number = 0): DiffItem {
        if (content?.startsWith(HEADER_INITIAL)) {
            return new Header(
                content,
                this.computeLine(key),
                this.computeNewLine(key, () => this.headerLine++)
            )
        }

        if (original?.startsWith(HEADER_INITIAL) && content) {
            return new Added(
                content,
                this.computeLine(key),
                this.computeNewLine(key, () => this.addedLine++)
            )
        }

        if (
            original !== undefined &&
            content !== undefined &&
            original !== content
        )
            return new Updated(
                original,
                content,
                this.computeLine(key),
                this.computeNewLine(key)
            )
        else if (original !== undefined && content == undefined) {
            return new Removed(
                original,
                this.computeLine(key),
                this.computeNewLine(key, () => this.removedLine++)
            )
        } else
            return new Added(
                content!,
                this.computeLine(key),
                this.computeNewLine(key, () => this.addedLine++)
            )
    }

    updated(item: Diff.ArrayChange<string>, index: number) {
        if (!(item.removed && this.peak(index + 1, ['added']))) return 0

        this.skipCount = 1
        const peaked = this.diff[index + 1]

        const nvalues = Array.from({
            length: Math.max(item.value.length, peaked.value.length),
        }).map((_, key) =>
            this.updatedMap(item.value[key], peaked.value[key], key)
        )

        this.result.push(...nvalues)

        this.line += nvalues.length

        return 1
    }

    added(item: Diff.ArrayChange<string>, index: number) {
        if (!this.peak(index, ['added'])) return 0

        const nvalues = item.value.map((content, key) => {
            if (content.startsWith(HEADER_INITIAL)) {
                return new Header(
                    content,
                    this.computeLine(key),
                    this.computeNewLine(key, () => this.headerLine++)
                )
            }

            return new Added(
                content,
                this.computeLine(key),
                this.computeNewLine(key, () => this.addedLine++)
            )
        })

        this.result.push(...nvalues)

        this.line += nvalues.length

        return 1
    }

    removed(item: Diff.ArrayChange<string>, index: number) {
        if (!this.peak(index, ['removed'])) return 0

        const nvalues = item.value.map((content, key) => {
            if (content.startsWith(HEADER_INITIAL)) {
                return new Header(
                    content,
                    this.computeLine(key),
                    this.computeNewLine(key, () => this.headerLine++)
                )
            }

            return new Removed(
                content,
                this.computeLine(key),
                this.computeNewLine(key, () => this.removedLine++)
            )
        })

        this.result.push(...nvalues)

        this.line += nvalues.length

        return 1
    }

    peak(index: number, expect: Array<'added' | 'removed' | 'overflow'>) {
        const expectations = new Set(expect)

        if (index >= this.diff.length && expectations.has('overflow'))
            return true
        else if (index >= this.diff.length) return false

        const item = this.diff[index]

        if (
            (item.added && expectations.has('added')) ||
            (item.removed && expectations.has('removed'))
        )
            return true

        return false
    }

    skip() {
        if (this.skipCount == 0) return 0
        this.skipCount--
        return 1
    }

    compute() {
        for (let i = 0; i < this.diff.length; i++) {
            const item = this.diff[i]

            if (this.skip()) continue
            if (this.consistent(item)) continue
            if (this.updated(item, i)) continue
            if (this.removed(item, i)) continue
            if (this.added(item, i)) continue
        }

        return this.result
    }
}

type Payload = {
    lines: string[]
    workspaceId: string
    variantId: string
}

export default function Reducer(state: State, action: PayloadAction<Payload>) {
    const instance = state.instances.find(
        (lyrics) => lyrics.workspace == action.payload.workspaceId
    )

    const linesFd = instance?.variants.find(
        (variant) => variant.id == action.payload.variantId
    )?.lines

    const lines = linesFd?.map((line) => line.content)

    if (!lines || !linesFd || !instance) return

    let nlines = action.payload.lines

    nlines = nlines.map((line) => {
        if (line.startsWith('~')) return `${HEADER_INITIAL}${line.slice(1)}`
        return line
    })

    const diff = new Diffing(lines, nlines).compute()

    const variant = instance.variants.find(
        (item) => item.id === action.payload.variantId
    )

    if (!variant) return

    const newlines: Array<Line> = []

    const genId = (line: number, content: string) =>
        String(cyrb53(`${line}${content}`))

    const syncActions: Array<LinesSync> = []

    const remapId = (id: string, nid: string, line: number) => {
        if (id === nid) return
        syncActions.push({ type: 'remap', id, nid, line: line + 1 })
    }

    const add = (id: string, line: number) => {
        syncActions.push({ type: 'add', id, line: line + 1 })
    }

    const remove = (id: string) => {
        syncActions.push({ type: 'remove', id })
    }

    for (const item of diff) {
        const line = item.newline + 1

        if (item instanceof Header) {
            const nid = genId(item.newline, item.content)
            newlines.push({
                id: nid,
                content: item.content,
                line,
            })
        } else if (item instanceof Consistent) {
            const nid = genId(item.newline, item.content)
            remapId(genId(item.line, item.content), nid, item.newline)

            newlines.push({
                id: nid,
                content: item.content,
                line,
            })
        } else if (item instanceof Added) {
            const nid = genId(item.newline, item.content)
            add(nid, item.line)
            newlines.push({
                id: nid,
                content: item.content,
                line,
            })
        } else if (item instanceof Updated) {
            const nid = genId(item.newline, item.content)
            remapId(genId(item.line, item.original), nid, item.newline)

            newlines.push({
                id: nid,
                content: item.content,
                line,
            })
        } else if (item instanceof Removed) {
            const nid = genId(item.newline, item.content)
            remove(nid)
        }
    }

    const linesSyncHash = cyrb53(syncActions.map((item) => item.id).join(''))

    instance.linesSyncHash = String(linesSyncHash)
    instance.linesSync = syncActions

    variant.lines = newlines
}
