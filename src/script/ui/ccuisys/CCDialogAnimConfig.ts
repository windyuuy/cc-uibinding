import { Animation, AnimationClip } from "cc"
import { ccclass, property } from "./convenient"

@ccclass("CCDialogAnimConfig")
export class CCDialogAnimConfig {

	@property({
		displayName: "播放动画",
	})
	needPlay: boolean = false

	@property({
		displayName: "播放完立即关闭",
	})
	needCloseOnDone: boolean = false

	@property({
		displayName: "动画",
		type: Animation,
	})
	anim!: Animation

	@property({
		displayName: "切片",
		type: AnimationClip,
	})
	clip!: AnimationClip

	@property({
		displayName: "切片名",
	})
	clipName: string = ""

	getClipName() {
		if (this.clipName) {
			return this.clipName
		} else if (this.clip) {
			return this.clip.name
		} else {
			return undefined
		}
	}
}
