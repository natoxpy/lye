import { PayloadAction } from '@reduxjs/toolkit'
import { State } from '../reducer'
import { v4 as uuidv4 } from 'uuid'
import * as Diff from 'diff'
import { cyrb53 } from '@/app/utils/hash'

class DiffItem {
    constructor(
        public content: string,
        public line: number,
        public newline: number,
        public type: string
    ) {}
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
    skipCount: number = 0

    constructor(
        public preLines: string[],
        public newLines: string[]
    ) {
        this.diff = Diff.diffArrays(preLines, newLines)
        this.result = []
    }

    consistent(item: Diff.ArrayChange<string>) {
        if (item.removed || item.added) return 0

        this.result.push(
            ...item.value.map(
                (i, key) =>
                    new Consistent(
                        i,
                        key + this.line,
                        key + this.line - this.removedLine
                    )
            )
        )

        this.line += item.value.length

        return 1
    }

    updatedMap(original?: string, content?: string, key: number = 0): DiffItem {
        if (
            original !== undefined &&
            content !== undefined &&
            original !== content
        )
            return new Updated(original, content, key, key - this.removedLine)
        else if (original !== undefined && content == undefined) {
            return new Removed(original, key, key - this.removedLine++)
        } else return new Added(content!, key, key - this.removedLine)
    }

    updated(item: Diff.ArrayChange<string>, index: number) {
        if (!(item.removed && this.peak(index + 1, ['added']))) return 0

        this.skipCount = 1
        const peaked = this.diff[index + 1]

        const nvalues = Array.from({
            length: Math.max(item.value.length, peaked.value.length),
        }).map((_, key) =>
            this.updatedMap(item.value[key], peaked.value[key], this.line + key)
        )

        this.result.push(...nvalues)

        this.line += nvalues.length

        return 1
    }

    added(item: Diff.ArrayChange<string>, index: number) {
        if (!this.peak(index, ['added'])) return 0

        const nvalues = item.value.map((content, key) => {
            return new Added(
                content,
                this.line + key,
                this.line + key - this.removedLine
            )
        })

        this.result.push(...nvalues)

        this.line += nvalues.length

        return 1
    }

    removed(item: Diff.ArrayChange<string>, index: number) {
        if (!this.peak(index, ['removed'])) return 0

        const nvalues = item.value.map((content, key) => {
            return new Removed(
                content,
                this.line + key,
                this.line + key - this.removedLine
            )
        })

        this.result.push(...nvalues)

        this.line += nvalues.length
        this.removedLine += nvalues.length

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
    const linesFd = state.instances
        .find((lyrics) => lyrics.workspace == action.payload.workspaceId)
        ?.variants.find((variant) => variant.id == action.payload.variantId)

    const lines = linesFd?.lines.map((line) => line.content)

    if (!lines) return

    const diff = new Diffing(lines, action.payload.lines).compute()

    const instance = state.instances.find(
        (item) => item.workspace === action.payload.workspaceId
    )

    const variant = instance?.variants.find(
        (item) => item.id === action.payload.variantId
    )

    if (!variant) return

    const newlines = []

    for (const item of diff) {
        console.log(item)
    }

    console.log('----')

    console.log(JSON.stringify(newlines, null, 4))

    variant.lines = action.payload.lines.map((i) => ({
        id: uuidv4(),
        content: i,
    }))
}
