import { Button, EventTouch, Node, Prefab } from "cc";
import { AudioRes } from "../../../configs/AudioRes";
import { MyNodePool } from "../../../game/resmg/MyNodePool";
import { CCAudioSource } from "../../ccomps/CCAudioSource";
import { EmptyTable, TStrMap } from "../basic";
import { LayerMGComp } from "../CCLayerMGComp";
import { AudioSourceB } from "./AudioSource2";
import { AudioUserConfig } from "./TAudioUserConfig";
import { TAudioSourceConfig } from "./TAudioSourceConfig";
import { AudioManagerStatus } from "./TAudioManagerStatus";

/**
 * 音效管理
 */
export class TAudioManager {

	/**
	 * 音效配置map
	 */
	protected audiosMap: TStrMap<TAudioSourceConfig> = EmptyTable()

	protected toAudioUri(key: string) {
		// return `prefabs/ui/${key}`
		return key
	}

	/**
	 * 加载音效配置
	 * @param uri
	 * @param onDone
	 * @param onError
	 * @param prefab
	 * @returns
	 */
	loadAudioConfig(uri: string, onDone?: (config: TAudioSourceConfig) => void, onError?: (err: any) => void, prefab?: Prefab) {
		uri = this.toAudioUri(uri)
		let config = this.getAudioConfig(uri)
		if (config.isLoaded) {
			onDone && onDone(config)
			return
		}

		let loadConfig = (uri: string, prefab: Prefab, err: any) => {
			if (err) {
				onError && onError(err)
				return
			}

			if (!config.isLoaded) {
				let node = prefab.data as Node
				let audios = node.getComponents(CCAudioSource)
				audios.forEach(audio => audio.doLoad())
				let config = new TAudioSourceConfig()
				config.initAudios(audios)
				this.audiosMap[uri] = config
			}
			let audios = this.audiosMap[uri]
			onDone && onDone(audios)
		}
		if (prefab) {
			loadConfig(uri, prefab, undefined)
		} else {
			MyNodePool.loadPrefab(uri, (prefab, err) => {
				loadConfig(uri, prefab, err)
			})
		}
	}

	/**
	 * 获取音效配置
	 * @param uri
	 * @returns
	 */
	getAudioConfig(uri: string) {
		uri = this.toAudioUri(uri)
		let config = this.audiosMap[uri]
		if (config == null) {
			config = this.audiosMap[uri] = new TAudioSourceConfig()
		}
		return config
	}

	/**
	 * 对按钮统一注入音效事件
	 */
	injectButtonEffect() {
		let old_onTouchEnded = Button.prototype["_onTouchEnded"];
		let config = AudioManager.getAudioConfig(AudioRes.通用音效配置)
		let commonAudio = LayerMGComp.inst.addComponent(AudioSourceB)!
		commonAudio.playOnAwake = false
		let clickEffect = config.getAudio("按钮点击音效")
		if (clickEffect) {
			clickEffect.setCCAudioSource(commonAudio)
		}
		commonAudio.stop()
		Button.prototype["_onTouchEnded"] = function (event?: EventTouch) {
			if (this.interactable) {
				if (AudioUserConfig.isEffectEnabled) {
					console.warn("resumeAudio:", commonAudio.name, commonAudio.clip?.name)
					commonAudio.play()
				}
			}
			return old_onTouchEnded.call(this, event)
		}
	}

	setMusicEnabled(b: boolean) {
		AudioUserConfig.isMusicEnabled = b
		if (b) {
			AudioManagerStatus.unmuteAllMusicsInPlaylist()
		} else {
			AudioManagerStatus.muteAllMusicsInPlaylist()
		}
	}

	setEffectEnabled(b: boolean) {
		AudioUserConfig.isEffectEnabled = b
	}

	/**
	 * 播放通用音效
	 * @param name
	 * @param node
	 */
	playCommonEffect(name: string, node: Node) {
		AudioManager.loadAudioConfig(AudioRes.通用音效配置, (config) => {
			config.playAudio(name, node)
		})
	}

	/**
	 * 播放游戏音效
	 * @param name
	 * @param node
	 */
	playGameEffect(name: string, node: Node) {
		AudioManager.loadAudioConfig(AudioRes.战斗音效配置, (config) => {
			config.playAudio(name, node)
		})
	}

	/**
	 * 播放游戏结算音效
	 * @param name
	 * @param node
	 */
	 playGameResultEffect(name: string, node: Node) {
		AudioManager.loadAudioConfig(AudioRes.战斗结算音效配置, (config) => {
			config.playAudio(name, node)
		})
	}

}

export const AudioManager = new TAudioManager()
