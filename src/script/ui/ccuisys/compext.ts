/*
 * @Author: your name
 * @Date: 2021-08-26 13:36:07
 * @LastEditTime: 2021-08-26 16:12:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\script\ui\core\compext.ts
 */

import { Animation, Component, director, Node, Renderable2D, sp, UITransform } from "cc";
import { EDITOR } from "cc/env";

declare module "cc" {
	interface Node {
		getOrAddComponent<T extends Component>(cls: new () => T): T
		getOrAddComponent<T extends Component>(name: string): T
		cn(name: string): Node | null
		cns(name: string): Node[]
		readonly uiTransform?: UITransform
		readonly ccAnimation?: Animation
	}

	interface Component {
		getOrAddComponent<T extends Component>(cls: new () => T): T
		getOrAddComponent<T extends Component>(name: string): T

		onAttach?(): void
		onDeattach?(): void
		cn(name: string): Node | null
		cns(name: string): Node[]
		readonly uiTransform?: UITransform
		readonly ccAnimation?: Animation
	}

	namespace sp {
		interface Skeleton {
			clearEndListener(): void
			clearCompleteListener(): void
		}
	}
}

sp.Skeleton.prototype.clearEndListener = function () {
	this.setEndListener(undefined as any)
}

sp.Skeleton.prototype.clearCompleteListener = function () {
	this.setCompleteListener(undefined as any)
}

Node.prototype.cn = function (name: string): Node | null {
	return this.getChildByName(name)
}

Node.prototype.cns = function (name: string): Node[] {
	return this.children.filter(c => c.name == name)
}

Node.prototype.getOrAddComponent = function <T extends Component>(cls: (new () => T) | string): T {
	let comp = this.getComponent(cls as any)
	if (comp == null) {
		comp = this.addComponent(cls as any)
	}
	return comp as any
}

Component.prototype.cn = function (name: string): Node | null {
	return this.node.getChildByName(name)
}

Component.prototype.cns = function (name: string): Node[] {
	return this.node.children.filter(c => c.name == name)
}

if (!Object.getOwnPropertyDescriptor(Node.prototype, "uiTransform")) {
	Object.defineProperty(Node.prototype, "uiTransform", {
		get: function () {
			let self = this as Node
			return self.getComponent(UITransform)
		},
		set: function (value) {
			throw new Error("cannot set uiTransform")
		},
	})
}

if (!Object.getOwnPropertyDescriptor(Node.prototype, "ccAnimation")) {
	Object.defineProperty(Node.prototype, "ccAnimation", {
		get: function () {
			let self = this as Node
			return self.getComponent(Animation)
		},
		set: function (value) {
			throw new Error("cannot set ccAnimation")
		},
	})
}

Component.prototype.getOrAddComponent = function <T extends Component>(cls: (new () => T) | string): T {
	let comp = this.getComponent(cls as any)
	if (comp == null) {
		comp = this.addComponent(cls as any)
	}
	return comp as any
}

if (!Object.getOwnPropertyDescriptor(Component.prototype, "uiTransform")) {
	Object.defineProperty(Component.prototype, "uiTransform", {
		get: function () {
			let self = this as Component
			return self.getComponent(UITransform)
		},
		set: function (value) {
			throw new Error("cannot set uiTransform")
		},
	})
}

if (!Object.getOwnPropertyDescriptor(Component.prototype, "ccAnimation")) {
	Object.defineProperty(Component.prototype, "ccAnimation", {
		get: function () {
			let self = this as Component
			return self.getComponent(Animation)
		},
		set: function (value) {
			throw new Error("cannot set ccAnimation")
		},
	})
}

const injectFixSetNodeActiveAndOpacity = () => {
	// let onEnable_old = Renderable2D.prototype.onEnable
	// Renderable2D.prototype.onEnable = function () {
	// 	this["_updateWorldAlpha"]()
	// 	let ret = onEnable_old.call(this)
	// 	return ret
	// }
	let _activateNodeRecursively_old = director._nodeActivator["_activateNodeRecursively"]
	director._nodeActivator["_activateNodeRecursively"] = function (node: Node, preloadInvoker, onLoadInvoker, onEnableInvoker) {
		// if (node._uiProps && node.parent && node.parent._uiProps) {
		// 	const localAlpha = node._uiProps.localOpacity;
		// 	node._uiProps.opacity = node.parent._uiProps.opacity * localAlpha;
		// }
		if (node._uiProps && node._uiProps.uiComp instanceof Renderable2D) {
			node._uiProps.uiComp["_updateWorldAlpha"]()
		}
		// if (node._uiProps && node._uiProps.uiComp instanceof Renderable2D) {
		// 	node._uiProps.uiComp["_colorDirty"] = true
		// }
		// if (node._uiProps && node._uiProps.uiComp instanceof Renderable2D && node.parent && node.parent._uiProps) {
		// 	const localAlpha = node._uiProps.localOpacity;
		// 	node._uiProps.opacity = node.parent._uiProps.opacity * localAlpha;
		// 	node._uiProps.uiComp["_renderFlag"] = true
		// }
		return _activateNodeRecursively_old.call(this, node, preloadInvoker, onLoadInvoker, onEnableInvoker)
	}

	// let onDisable_old = Renderable2D.prototype.onDisable
	// Renderable2D.prototype.onDisable = function () {
	// 	this["_updateWorldAlpha"]()
	// 	return onDisable_old.call(this)
	// }
}

if (!EDITOR) {
	setTimeout(() => {
		try {
			console.log("[system] try injectFixSetNodeActiveAndOpacity")
			injectFixSetNodeActiveAndOpacity()
			console.log("[system] try injectFixSetNodeActiveAndOpacity ok")
		} catch (e) {
			console.error("[system] try injectFixSetNodeActiveAndOpacity failed:", e)
		}
	})
}

// if (typeof (window) != "object") {
// 	let wx = (window as any)["wx"]
// 	if (wx) {
// 		let old_createInnerAudioContext = wx.createInnerAudioContext
// 		wx.createInnerAudioContext = function (obj: any) {
// 			let audio = old_createInnerAudioContext.apply(wx, obj)
// 			let old_pause = audio.pause
// 			audio.pause = function () {
// 				console.log("audio.pause")
// 				old_pause.apply(audio)
// 			}
// 			let old_play = audio.play
// 			audio.play = function () {
// 				console.log("audio.play")
// 				old_play.apply(audio)
// 			}
// 			let old_stop = audio.stop
// 			audio.stop = function () {
// 				console.log("audio.stop")
// 				old_stop.apply(audio)
// 			}
// 			return audio
// 		}
// 	}
// }
