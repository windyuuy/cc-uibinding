import { assert } from "cc";
import { DataBindHub } from "./DataBindHub";

export class DataBind {
	rawObj?: Object
	bindHub?: DataBindHub
	addBindHub(bindHub: DataBindHub) {
		this.bindHub = bindHub
		this.recoverWatchers()
	}
	removeBindHub(bindHub?: DataBindHub) {
		if (bindHub == undefined || this.bindHub == bindHub) {
			this.clearWatchers()
			this.bindHub = undefined
		} else {
			console.warn("invalid bindHub")
		}
	}

	protected presetWatchingExprs: {
		key: string,
		call: (value: T, oldValue: T) => void,
	}[] = []

	protected recordPresetExpr(expr: string, call: (value: T, oldValue: T) => void) {
		this.presetWatchingExprs.push({ key: expr, call })
	}

	protected unRecordPresetExpr(expr: string, call: (value: T, oldValue: T) => void) {
		let item = this.presetWatchingExprs.find(item => item.key == expr)
		if (item) {
			this.presetWatchingExprs.remove(item)
		}
	}

	protected watchingExprs: {
		key: string;
		callback: fsync.event.EventHandlerMV<any>;
	}[] = []

	protected easeWatchExpr(expr: string, call: (value: T, oldValue: T) => void) {
		if (this.bindHub) {
			let watcher = this.bindHub.easeWatchExprValue(expr, call)
			if (watcher) {
				this.watchingExprs.push(watcher)
			}
			return watcher
		}
		return undefined
	}
	watchExprValue<T>(expr: string, call: (value: T, oldValue: T) => void) {
		this.recordPresetExpr(expr, call)

		return this.easeWatchExpr(expr, call)
	}
	unWatchExprValue<T>(expr: string, call: (value: T, oldValue: T) => void) {
		this.unRecordPresetExpr(expr, call)

		let watcher = this.watchingExprs.find(watcher => watcher.callback == call && watcher.key == expr)
		if (watcher) {
			this.watchingExprs.remove(watcher)
			if (this.bindHub) {
				const bindHub = this.bindHub
				bindHub.easeUnWatchExprValue(expr, call)
			}
		}
	}

	recoverWatchers() {
		if (this.bindHub) {
			this.presetWatchingExprs.forEach(({ key, call }) => {
				this.easeWatchExpr(key, call)
			})
		}
	}
	clearWatchers() {
		if (this.bindHub) {
			const bindHub = this.bindHub
			this.watchingExprs.forEach(({ key, callback }) => {
				bindHub.easeUnWatchExprValue(key, callback)
			})
			this.watchingExprs.clear()
		}
		assert(this.watchingExprs.length == 0)
	}

	clear() {
		this.removeBindHub(this.bindHub)
	}

}
