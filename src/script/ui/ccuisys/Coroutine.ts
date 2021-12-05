import { Component, isValid } from "cc";
import { LayerMG } from "./basic";

/**
 * 绑定信息
 */
export class CoBindInfo {
	protected static _idAcc = 1
	id: number = CoBindInfo._idAcc++
	binder!: Component
	scheduler!: Component | typeof setTimeout
	call!: Function
	callId: any
	promise!: TCoRet
	cancelled = false
	seconds: number = 0
}

export type TCoRet = Promise<CoBindInfo>

/**
 * 协程调度相关api
 */
export interface ICoAPI {
	/**
	 * 清空所有协程调度对象
	 */
	clear?(): void
	/**
	 * 清理并停止执行调度
	 */
	close?(): void
	/**
	 * 在进程计时中等待sec秒, 不受组件生命周期约束
	 * @param bind
	 * @returns
	 */
	WaitForSecondsRealtimeUmlimit?(sec: number, bind?: Component): TCoRet
	/**
	 * 在进程计时中等待sec秒
	 * @param bind
	 * @returns
	 */
	WaitForSecondsRealtime(sec: number, bind?: Component): TCoRet
	/**
	 * 在渲染流程计时中, 等待sec秒
	 * @param bind
	 * @returns
	 */
	WaitForSeconds(sec: number, bind?: Component): TCoRet
	/**
	 * 等待一帧
	 * @param bind
	 * @returns
	 */
	WaitTick(bind?: Component): TCoRet
}

/**
 * 协程管理
 */
export class CoMG {
	/**
	 * 任务列表
	 */
	protected coList: Map<number, CoBindInfo> = new Map()
	enabled: boolean = true
	/**
	 * 清空所有协程调度对象
	 */
	clear() {
		this.coList.forEach((co) => {
			if (co.scheduler instanceof Component) {
				co.scheduler.unschedule(co.callId)
			} else if (typeof (co.scheduler) == "function") {
				clearTimeout(co.callId)
			} else {
				console.error("invalid scheduler:", co.scheduler)
			}
			co.cancelled = true
		})
		this.coList.clear()
	}
	/**
	 * 清理并停止执行调度
	 */
	close() {
		this.enabled = false
		this.clear()
	}
	/**
	 * 在进程计时中等待sec秒, 不受组件生命周期约束
	 * @param bind
	 * @returns
	 */
	WaitForSecondsRealtimeUmlimit(sec: number, bind?: Component): TCoRet {
		let bindInfo = new CoBindInfo()
		this.coList.set(bindInfo.id, bindInfo)
		let binder = bind ?? LayerMG.layerComp
		bindInfo.binder = binder
		bindInfo.seconds = sec
		let promise = new Promise<CoBindInfo>(resolve => {
			let call = () => {
				this.coList.delete(bindInfo.id)
				resolve(bindInfo)
			}
			bindInfo.call = call
			let timerId = setTimeout(call, sec * 1000);
			bindInfo.callId = timerId
			bindInfo.scheduler = setTimeout
		})
		bindInfo.promise = promise
		return promise
	}

	/**
	 * 在进程计时中等待sec秒
	 * @param bind
	 * @returns
	 */
	WaitForSecondsRealtime(sec: number, bind?: Component): TCoRet {
		let bindInfo = new CoBindInfo()
		this.coList.set(bindInfo.id, bindInfo)
		let binder = bind ?? LayerMG.layerComp
		bindInfo.binder = binder
		bindInfo.seconds = sec
		let promise = new Promise<CoBindInfo>(resolve => {
			let call = () => {
				this.coList.delete(bindInfo.id)
				if (this.enabled && isValid(binder, true)) {
					resolve(bindInfo)
				}
			}
			bindInfo.call = call
			let timerId = setTimeout(call, sec * 1000);
			bindInfo.callId = timerId
			bindInfo.scheduler = setTimeout
			bindInfo.promise = undefined as any
		})
		bindInfo.promise = promise
		return promise
	}
	/**
	 * 在渲染流程计时中, 等待sec秒
	 * @param bind
	 * @returns
	 */
	WaitForSeconds(sec: number, bind?: Component): TCoRet {
		let bindInfo = new CoBindInfo()
		this.coList.set(bindInfo.id, bindInfo)
		let binder = bind ?? LayerMG.layerComp as Component
		bindInfo.binder = binder
		bindInfo.seconds = sec
		let promise = new Promise<CoBindInfo>(resolve => {
			let call = () => {
				this.coList.delete(bindInfo.id)
				if (this.enabled) {
					resolve(bindInfo)
				}
			}
			bindInfo.call = call
			bindInfo.callId = call
			bindInfo.scheduler = binder
			binder.scheduleOnce(call, sec)
		})
		bindInfo.promise = promise
		return promise
	}
	/**
	 * 等待一帧
	 * @param bind 
	 * @returns 
	 */
	WaitTick(bind?: Component): TCoRet {
		let bindInfo = new CoBindInfo()
		this.coList.set(bindInfo.id, bindInfo)
		let binder = bind ?? LayerMG.layerComp as Component
		bindInfo.binder = binder
		bindInfo.seconds = 0
		let promise = new Promise<CoBindInfo>(resolve => {
			let call = () => {
				this.coList.delete(bindInfo.id)
				if (this.enabled) {
					resolve(bindInfo)
				}
			}
			bindInfo.call = call
			bindInfo.callId = call
			bindInfo.scheduler = binder
			binder.scheduleOnce(call, 0)
		})
		bindInfo.promise = promise
		return promise
	}
}

export async function WaitForSecondsRealtime(sec: number, bind?: Component): Promise<void> {
	return new Promise<void>(resolve => {
		bind = bind ?? LayerMG.layerComp
		setTimeout(() => {
			if (isValid(bind, true)) {
				resolve()
			}
		}, sec * 1000);
	})
}

export async function WaitForSeconds(sec: number, bind?: Component): Promise<void> {
	return new Promise<void>(resolve => {
		bind = bind ?? LayerMG.layerComp as Component
		bind.scheduleOnce(resolve, sec)
	})
}

export async function WaitTick(bind?: Component): Promise<void> {
	return new Promise<void>(resolve => {
		bind = bind ?? LayerMG.layerComp as Component
		bind.scheduleOnce(resolve, 0)
	})
}

export async function DelayTask<T>(call: () => Promise<T>, dt: number = 0): Promise<T> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			call().then((v: T) => {
				resolve(v)
			}, (reason) => {
				reject(reason)
			})
		}, dt)
	})
}

export async function ScheduleDelayTask<T>(call: () => Promise<T>, dt: number = 0, bind?: Component): Promise<T> {
	return new Promise((resolve, reject) => {
		bind = bind ?? LayerMG.layerComp as Component
		bind.scheduleOnce(() => {
			call().then((v: T) => {
				resolve(v)
			}, (reason) => {
				reject(reason)
			})
		}, dt)
	})
}
