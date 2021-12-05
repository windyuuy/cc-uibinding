/*
 * @Author: your name
 * @Date: 2021-09-18 11:30:24
 * @LastEditTime: 2021-09-18 14:44:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\script\ui\dialogs\PlaySpineAnimSettings.ts
 */
/**
 * 用于播放spine动画的设置
 */

import { Animation, sp } from "cc";

export enum TSpineAnimEvent {
	Complete = "Complete",
	Finished = "Finished",
}

export type TSpineAnimCallback = (animName: string, name: TSpineAnimEvent, target: sp.Skeleton | Animation) => void

export class PlaySpineAnimSettings {
	animName: string = "";
	isLoop: boolean = false;
	trackIndex: number = 0;
	// animEvent: fsync.event.SimpleEventMV<any> = new fsync.event.SimpleEventMV()
	callback?: TSpineAnimCallback = undefined
	protected onStop() {
		this.animName = ""
	}

	protected isDirty: number = 0
	public play() {
		this.isDirty++
	}
}
