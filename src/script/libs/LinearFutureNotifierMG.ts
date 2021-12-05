import { DevInfo } from "../configs/DevInfo"

export type FutureCall<T> = (f: T) => void

export type TOnConsumedFunc = Function
export class FutureNotifier {
	key!: string
	promise?: any
	call?: FutureCall<any>
	// test only
	data?: any
	onConsumed?: Function
}

export class PendingNotify {
	key!: string
	data!: any
	onConsumed!: Function
}

/**
 * 消息转异步事件队列
 * - 异步事件方式监听未来的通知
 */
export class LinearFutureNotifierMG {
	name: string = "unkown"
	withName(name: string) {
		this.name = name
		return this
	}

	protected pendingNotifies: PendingNotify[] = []
	protected futureMap: Map<string, FutureNotifier[]> = new Map();
	protected currentFuture?: FutureNotifier

	clear() {
		this.pendingNotifies.clear()
		this.futureMap.clear()
		this.currentFuture = undefined
		this.pauseList.clear()
	}

	clearPromise() {
		this.futureMap.clear()
		this.pauseList.clear()
	}

	/**
	 * 放弃所有的promise, 全部标记为已完成
	 */
	abortPromise() {
		this.clear()
	}

	protected popPendingNotify() {
		return this.pendingNotifies.shift()
	}
	protected pushPendingNotify(key: string, data: any, onConsumed: Function) {
		let n = new PendingNotify()
		n.key = key
		n.data = data
		n.onConsumed = onConsumed
		this.pendingNotifies.push(n)
	}
	protected getPendingNotify() {
		return this.pendingNotifies[0]
	}

	protected getFuturePool(key: string): FutureNotifier[] {
		let pool = this.futureMap.get(key)
		if (pool == null) {
			pool = []
			this.futureMap.set(key, pool)
		} else {
			// 从现有的池中移除过期项目
			while (true) {
				let item = pool[0]
				if (item != undefined) {
					if (item.call == undefined && item.promise == undefined) {
						pool.shift()
					} else {
						break
					}
				} else {
					break
				}
			}
		}
		return pool
	}

	private _isPause: boolean = false
	public get isPause(): boolean {
		return this._isPause
	}
	public set isPause(value: boolean) {
		this._isPause = value
		// console.error(new Error("pause").stack)

		if (!value) {
			while (this.pauseList.length > 0) {
				let { call, value } = this.pauseList.shift()!
				call(value)
			}
		}
	}
	protected pauseList: { call: (value: any) => void, value: any }[] = []
	protected toPauseablePromise<T>(promise: Promise<T>) {
		return new Promise<T>((resolve, reject) => {
			promise.then((value) => {
				if (this.isPause) {
					this.pauseList.push({ call: resolve, value })
				} else {
					resolve(value)
				}
			}, (reason) => {
				if (this.isPause) {
					this.pauseList.push({ call: reject, value: reason })
				} else {
					reject(reason)
				}
			})
		})
	}

	protected createFutureNotifier(key: string, futures: FutureNotifier[]) {
		let future0 = new FutureNotifier()
		future0.key = key
		let promise = new Promise<any>((resolve, reject) => {
			future0.call = resolve
		});
		future0.promise = promise
		futures.push(future0)
		return future0
	}

	/**
	 * 等待未来的通知
	 * @param key
	 * @param clean
	 * @returns
	 */
	waitDone<T>(key: string, overwrite: boolean = false, clean: boolean = true): Promise<T> {
		let futures = this.getFuturePool(key)
		let future: FutureNotifier | undefined
		// 寻找第一个未领尽的等待
		for (let f of futures) {
			if (f.promise) {
				future = f
				break
			}
		}

		if (future == undefined) {
			if (overwrite) {
				for (let f of futures) {
					f.call = undefined
					f.promise = undefined
				}
				futures.clear()
				future = this.createFutureNotifier(key, futures)
			} else {
				future = this.createFutureNotifier(key, futures)
			}
		} else {
			if (overwrite && this.currentFuture != future) {
				for (let f of futures) {
					f.call = undefined
					f.promise = undefined
				}
				futures.clear()
				future = this.createFutureNotifier(key, futures)
			} else if (future.promise == undefined) {
				future = this.createFutureNotifier(key, futures)
			}
		}
		let promise = future.promise
		if (clean) {
			future.promise = undefined
		}

		// 检查future, 目前都需要一一消耗
		if (this.currentFuture && this.currentFuture !== future) {
			console.warn(`error: unmatched future: (expect)${this.currentFuture.key} !== ${future.key}`)
		}

		if (this.currentFuture && this.currentFuture.promise == undefined && this.currentFuture.call == undefined) {
			console.log("runout currentFuture", this.name, future.key, future)
			let onConsumed = this.currentFuture.onConsumed
			onConsumed && onConsumed()
			this.currentFuture = undefined
		}
		if (this.currentFuture == undefined) {
			if (future == this.currentFuture) {
				this.tickOverNotify()
			} else {
				setTimeout(() => {
					this.tickOverNotify()
				}, 0)
			}
			// setTimeout(() => {
			// 	this.tickOverNotify()
			// }, 0)
		}

		if (promise == null) {
			console.error("invalid promise returned!!")
		}

		// return promise
		let pauseablePromise = this.toPauseablePromise<T>(promise as Promise<T>)
		return pauseablePromise
	}

	protected tickNotify(): boolean {
		// 如果当前有正在等待的future, 那么挂起
		if (this.currentFuture) {
			return false
		}

		// 获取最早的通知数据
		let notify = this.getPendingNotify()
		if (notify == undefined) {
			return false
		}
		let { key, data, onConsumed } = notify

		let futures = this.getFuturePool(key);
		// 寻找第一个未通知的等待
		let future: FutureNotifier | undefined
		for (let f of futures) {
			if (f.call) {
				future = f
				break
			}
		}

		let notifyCall: FutureCall<any> | undefined
		if (future != null) {
			if (future.call) {
				// 存在合适的等待
				notifyCall = future.call
			} else {
				throw new Error("此处不应该存在: 等待已通知, 正在等待领取")
			}
		} else {
			// 不存在合适的等待宿主, 那么新建一个
			future = this.createFutureNotifier(key, futures)
			notifyCall = future!.call
		}
		console.log("pop pendingnotify:", this.name, key)
		// 弹出确定使用的数据项
		this.popPendingNotify()
		future.onConsumed = onConsumed
		// debug only
		if (DevInfo.isDev) {
			future.data = data
		}
		notifyCall!(data);
		// 标记已通知
		future.call = undefined

		if (future.promise) {
			// 等待领取
			console.log("set currentFuture", this.name, future.key, future)
			this.currentFuture = future
		} else {
			console.log("skip runout currentFuture", this.name, future.key, future)
			if (this.currentFuture === undefined) {
				setTimeout(() => {
					onConsumed && onConsumed()
				});
			}
		}

		return true
	}

	protected tickOverNotify() {
		while (this.tickNotify()) {
		}
	}

	/**
	 * 通知事件抵达
	 * @param key
	 * @param f
	 * @param allowOverwrite
	 */
	notifyDone<T>(key: string, data: T, onConsumed: Function): void {
		this.pushPendingNotify(key, data, onConsumed)
		if (this.enabled) {
			this.tickOverNotify()
		}
	}

	private _enabled: boolean = true
	public get enabled(): boolean {
		return this._enabled
	}
	public set enabled(value: boolean) {
		this._enabled = value
		if (this._enabled) {
			this.tickOverNotify()
		}
	}

}
