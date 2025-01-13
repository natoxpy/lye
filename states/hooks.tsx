import { create } from 'zustand'

import { timedLinesStore } from './timed-lines'

export const useTimedLinesStore = create(() => timedLinesStore)
