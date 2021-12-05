import { Animation, Component, director, Node, Prefab, _decorator } from "cc";
import { AudioRes } from "../../configs/AudioRes";
import { MyNodePool } from "../../game/resmg/MyNodePool";
import { AudioManager } from "./audio/AudioManager";
import { CCDialogAnimConfig } from "./CCDialogAnimConfig";
import { CCDialog } from "./CCDialogComp";
import { ccclass, menu, property } from "./convenient";
import { GameLog } from "./GameLog";
import { ICCReuse } from "./ICCReuse";

@ccclass("对话框配置")
@menu("对话框配置")
export class CCDialogConfig extends Component {
	@property({
		type: Prefab,
		displayName: "音效配置",
	})
	audioConfig!: Prefab

	@property({
		displayName: "自动播放背景音效",
	})
	audioPlayBGMusics: boolean = true

	@property({
		displayName: "播放弹窗音效",
	})
	playShowDialogAudio: boolean = false

	@property({
		displayName: "打开动画"
	})
	openAnim: CCDialogAnimConfig = new CCDialogAnimConfig()

	@property({
		displayName: "关闭动画"
	})
	closeAnim: CCDialogAnimConfig = new CCDialogAnimConfig()

	onLoad() {
		let dialog = this.getComponent(CCDialog)

		if (dialog) {
			if (this.audioConfig) {
				let node = this.audioConfig.data as Node
				let uri = `${this.audioConfig._uuid}_${node.name}`
				MyNodePool.registerPrefab(uri, this.audioConfig)
				AudioManager.loadAudioConfig(uri, undefined, (err) => {
					GameLog.error(`load res failed:`, err)
				}, this.audioConfig)
				dialog.loadAudioConfig(uri)
			}

			this.applyAnimConfig(dialog, this.openAnim, "playOpenAnimation")
			this.applyAnimConfig(dialog, this.closeAnim, "playCloseAnimation")
		}

		this.node.on(ICCReuse.Reuse, () => {
			this.onShow()
		})


	}


	onDestroy() {
		this.node.targetOff(this)
	}

	protected applyAnimConfig(dialog: CCDialog, animConfig: CCDialogAnimConfig, prop: "playOpenAnimation" | "playCloseAnimation") {
		if (animConfig.anim && animConfig.needPlay && dialog.playCloseAnimation == null) {
			let onDoneCalls: Function[] = []
			let call = function (call: Function) {
				onDoneCalls.push(call)
				animConfig.anim.stop()
				animConfig.anim.play(animConfig.getClipName())
			}
			// dialog[prop]=call
			Object.defineProperty(dialog, prop, {
				value: call,
			})
			let onAnimFinish = () => {
				this.scheduleOnce(() => {

					let calls = onDoneCalls.concat()
					onDoneCalls.clear()
					calls.forEach(call => call())

					if (animConfig.needCloseOnDone) {
						dialog.close()
					}
				})
			}
			animConfig.anim.targetOff(animConfig.anim)
			animConfig.anim.on(Animation.EventType.FINISHED, onAnimFinish, animConfig.anim)
		}
	}

	onShow() {
		if (this.playShowDialogAudio) {
			AudioManager.playCommonEffect("弹窗音效", this.node)
		}
	
		let dialog = this.getComponent(CCDialog)
		if (dialog) {
			if (this.audioPlayBGMusics) {
				dialog.playRandomBGM();
			}
		}
	}

}
