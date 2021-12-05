
// import "../../deps/lang.js"
// import "../../deps/fsync.js"
// import "../../deps/gcccomps.js"
// import "../../deps/kitten"

import { EDITOR } from "cc/env"

// import { Node } from "cc";
// let gg = Node.prototype.getComponent
// Node.prototype.getComponent = function (typeOrClassName: any) {
// 	try {
// 		return gg.call(this, typeOrClassName)
// 	} catch (e) {
// 		console.error("load node failed:", this.name)
// 		console.error(e)
// 	}
// }

class TNone {
	init(...args: any[]) {
		return this
	}
	setStartTime(...args: any[]) {

	}
}

const AnyFunc = function (...args: any[]) { } as any


export let EmptyMap = () => { return new Map() }
export let EmptyTable = () => { return {} }
export type PPromise<T> = fsync.PPromise<T>
// export let PPromise: typeof fsync.PPromise
export let DialogModel!: typeof gcc.layer.DialogModel
export let LayerUriUtil!: typeof gcc.layer.LayerUriUtil

export type DialogModel = gcc.layer.DialogModel
export let ShowDialogParam!: typeof gcc.layer.ShowDialogParam
export type ShowDialogParam = gcc.layer.ShowDialogParam
export let ShowBundleParams!: typeof gcc.layer.ShowBundleParams
export type ShowBundleParams = gcc.layer.ShowBundleParams
export let CloseDialogParam!: typeof gcc.layer.CloseDialogParam
export type CloseDialogParam = gcc.layer.CloseDialogParam


export let NumberArray!: typeof fsync.NumberArray
export type NumberArray = fsync.NumberArray
export let ArrayHelper!: typeof lang.helper.ArrayHelper
export let LayerMG!: typeof gcc.layer.LayerMG
export type Timer = fsync.Timer;
export let Timer: typeof fsync.Timer = TNone as any

export let withVec3!: typeof gcc.objpool.withVec3
export let withQuat!: typeof gcc.objpool.withQuat
export let withMat4!: typeof gcc.objpool.withMat4
export let withList!: typeof gcc.objpool.withList

export type SEvent<T> = fsync.event.SEvent<T>
export let SEvent: typeof fsync.event.SEvent = TNone as any
export type SimpleEvent<T> = fsync.event.SimpleEvent<T>
export let SimpleEvent: typeof fsync.event.SimpleEvent = (function () { }) as any
export type SEventMV<T> = fsync.event.SEventMV<T>
export let SEventMV: typeof fsync.event.SEventMV = TNone as any
export type SimpleEventMV<T> = fsync.event.SimpleEventMV<T>
export let SimpleEventMV: typeof fsync.event.SimpleEventMV = (function () { }) as any

export type TStrMap<T> = { [key: string]: T }
export type TNumMap<T> = { [key: number]: T }
export type LayerBundleInputItem = gcc.layer.LayerBundleInputItem

export type LayerBundle = gcc.layer.LayerBundle
export let LayerBundle: typeof gcc.layer.LayerBundle = TNone as any

export let cname: typeof lang.cname = function (name: string) {
	return function (target: any) {
		return target;
	}
}

export function MatchBits(v: number, mask: number) {
	let ret = (v & mask) == mask
	return ret;
}

if (!EDITOR) {
	try {
		EmptyTable = lang.EmptyTable
		DialogModel = gcc.layer.DialogModel
		LayerUriUtil = gcc.layer.LayerUriUtil
		ShowDialogParam = gcc.layer.ShowDialogParam
		ShowBundleParams = gcc.layer.ShowBundleParams
		CloseDialogParam = gcc.layer.CloseDialogParam
		NumberArray = fsync.NumberArray
		ArrayHelper = lang.helper.ArrayHelper
		LayerMG = gcc.layer.LayerMG
		Timer = fsync.Timer;
		withVec3 = gcc.objpool.withVec3
		withQuat = gcc.objpool.withQuat
		withMat4 = gcc.objpool.withMat4
		withList = gcc.objpool.withList
		// PPromise = fsync.PPromise
		SEvent = fsync.event.SEvent
		SimpleEvent = fsync.event.SimpleEvent
		SEventMV = fsync.event.SEventMV
		SimpleEventMV = fsync.event.SimpleEventMV
		cname = lang.cname
		lang.setSupportClassProguard(false)
		LayerBundle = gcc.layer.LayerBundle

			;
		; (globalThis as any)["LayerMG"] = LayerMG;
	} catch (e) {
		console.error("load libs failed.")
	}
}
