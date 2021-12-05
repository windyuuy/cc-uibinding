import { EDITOR } from "cc/env"

/**
 * 统筹管理定时器
 */
export let Intervals: typeof fsync.Intervals
if (!EDITOR) {
	Intervals = fsync.Intervals
}
