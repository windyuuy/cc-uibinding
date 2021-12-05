import * as cc from "cc";
import { EDITOR } from "cc/env";
import { AudioManager } from "./audio/AudioManager";
import { TAudioSourceConfig } from "./audio/TAudioSourceConfig";
import { DialogModel, LayerBundle, LayerBundleInputItem, LayerMG, ShowDialogParam, TStrMap } from "./basic";
import { CCNodePoolMapV2, CCNodePoolV2 } from "./CCNodePoolV2";
import { ccclass } from "./convenient";
import { CoMG, ICoAPI, TCoRet } from "./Coroutine";
import { CCDataHost } from "./databinding/CCDataHost";
import { UILog } from "./GameLog";
import { ICCDialog, IDialogDelegate } from "./ICCDialog";
import { ICCReuse } from "./ICCReuse";

/**
 * 递归同步节点透明度
 * @param node 
 */
const syncOpacity = (node: cc.Node) => {
	if (node._uiProps && node.parent && node.parent._uiProps) {
		const localAlpha = node._uiProps.localOpacity;
		node._uiProps.opacity = node.parent._uiProps.opacity * localAlpha;

		// if (node._uiProps.uiComp instanceof cc.Renderable2D) {
		// 	node._uiProps.uiComp.onRestore()
		// }
	}
	let children = node.children
	for (let i = 0; i < children.length; i++) {
		let child = children[i]
		if (child.activeInHierarchy) {
			syncOpacity(child)
		}
	}
}

/**
 * 对话框基类
 */
@ccclass("CCDialogComp")
export class CCDialogComp extends cc.Component implements ICoAPI, ICCDialog {

	/**
	 * 组合一些附加的业务
	 */
	protected sideEffect?: IDialogDelegate

	constructor(...args: any[]) {
		super(...args)
		if (!EDITOR) {
			this.__initConstructor()
		}
	}

	private __initConstructor() {
		this.doCreateDialogModel()
	}

	protected doCreateDialogModel() {
		this.dialogModel = new DialogModel()
	}

	//#region layer bundle manager
	static sharedLayerBundle = new LayerBundle()
	protected get layerBundle() {
		return CCDialogComp.sharedLayerBundle
	}

	/**
	 * 构建图层束
	 */
	setupOneBundle(name: string, items: LayerBundleInputItem[]) {
		return this.layerBundle.setupOneBundle(name, items)
	}

	/**
	 * 批量构建图层束
	 */
	setupBundles(map: TStrMap<LayerBundleInputItem[]>) {
		return this.layerBundle.setupBundles(map)
	}

	/**
	 * 展示图层束
	 */
	showBundle(name: string | gcc.layer.ShowBundleParams) {
		return this.layerBundle.showBundle(name)
	}

	/**
	 * 关闭图层束
	 */
	closeBundle(name: string) {
		return this.layerBundle.closeBundle(name)
	}

	/**
	 * 隐藏图层束
	 */
	hideBundle(name: string) {
		return this.layerBundle.hideBundle(name)
	}

	/**
	 * 预加载图层束
	 */
	preloadBundle(name: string) {
		return this.layerBundle.preloadBundle(name)
	}
	//#endregion

	//#region coroutine
	protected coMG = new CoMG
	WaitForSecondsRealtimeUmlimit(sec: number, bind?: cc.Component): TCoRet {
		return this.coMG.WaitForSecondsRealtime(sec, bind ?? this)
	}
	WaitForSecondsRealtime(sec: number, bind?: cc.Component): TCoRet {
		return this.coMG.WaitForSecondsRealtime(sec, bind ?? this)
	}
	WaitForSeconds(sec: number, bind?: cc.Component): TCoRet {
		return this.coMG.WaitForSeconds(sec, bind ?? this)
	}
	WaitTick(bind?: cc.Component): TCoRet {
		return this.coMG.WaitTick(bind ?? this)
	}
	/**
	 * 清理协程对象
	 */
	clearCoroutines() {
		this.coMG.clear()
	}
	//#endregion

	//#region lifecycle
	/**
	 * 显示对话框
	 * @param uri
	 * @returns
	 */
	showDialog(uri: string | ShowDialogParam) {
		let p: ShowDialogParam
		if (typeof (uri) == "string") {
			p = new ShowDialogParam(uri)
		} else {
			p = uri
		}
		return LayerMG.showDialog(p)
	}

	/**
	 * 寻找对应资源ID的对话框
	 * @param resUri
	 * @returns
	 */
	findDialogsByResUri(resUri: string) {
		return LayerMG.findDialogsByResUri(resUri)
	}

	/**
	 * 寻找所有同类对话框
	 * @param resUri
	 * @returns
	 */
	findSameKindDialogs() {
		return this.findDialogsByResUri(this.dialogModel.resUri)
	}

	/**
	 * 创建对话框
	 * @param uri
	 * @returns
	 */
	createDialog(uri: string | ShowDialogParam) {
		let p: ShowDialogParam
		if (typeof (uri) == "string") {
			p = new ShowDialogParam(uri)
		} else {
			p = uri
		}
		return LayerMG.createDialog(p)
	}
	/**
	 * 预加载对话框
	 * @param uri
	 * @returns
	 */
	preloadDialog(uri: string | ShowDialogParam) {
		let p: ShowDialogParam
		if (typeof (uri) == "string") {
			p = new ShowDialogParam(uri)
		} else {
			p = uri
		}
		return LayerMG.preloadDialog(p)
	}
	/**
	 * 关闭对话框
	 * @param uri
	 * @returns
	 */
	closeDialog(uri: string) {
		return LayerMG.closeDialog(uri)
	}
	/**
	 * 关闭所有对话框
	 * @param uri
	 * @returns
	 */
	closeAllDialogs() {
		return LayerMG.closeAllDialogs()
	}

	/**
	 * 强制关闭并销毁对话框
	 * @returns
	 */
	destroyDialog(uri: string) {
		return LayerMG.destoryDialog(uri)
	}

	/**
	 * 对话框数据模型
	 */
	dialogModel!: DialogModel

	/**
	 * 对话框模型中的自定义数据
	 */
	get rawData() {
		return this.dialogModel.data
	}

	/**
	 * 设置对话框tag
	 * @param tags 
	 */
	setTags(tags: string[]) {
		this.dialogModel.tags = tags
	}

	/**
	 * 设置对话框tag
	 * @param tags
	 */
	setTag(tag: string) {
		this.setTags([tag])
	}

	/**
	 * 遮罩节点
	 * @unused
	 */
	// @property({
	// 	displayName: "遮罩",
	// 	tooltip: "可空, 使用默认值",
	// 	type: cc.Node,
	// })
	maskLayer?: cc.Node

	/**
	 * 初次创建调用
	 */
	protected onCreate(data?: Object) {
		this.integrateDataBind()
		this.onInit && this.onInit(data)
	}

	/**
	 * 创建对话框完成时调用
	 * @param data
	 */
	protected onInit?(data?: Object): void

	private __callOnEnter() {
		this.onEnter && this.onEnter()
	}

	/**
	 * 进入初次显示状态
	 */
	protected onEnter?(): void

	/**
	 * 获取当前默认的layer管理器
	 */
	protected get layerMG() {
		return gcc.layer.LayerMG;
	}

	/**
	 * 异步关闭
	 */
	private __callDoClose(resolve: () => void, reject: (reason: any) => void) {
		this.doCloseAsync().then(resolve, (reason) => reject(reason))
	}

	protected doCloseAsync(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (this.playCloseAnimation) {
				this.playCloseAnimation(() => {
					resolve()
				})
			} else {
				resolve()
			}
		})
	}


	/**
	 * 播放关闭动画
	 */
	private __callDoOpen(resolve: () => void, reject: (reason: any) => void) {
		this.doOpenAsync().then(resolve, (reason) => reject(reason))
	}

	protected doOpenAsync() {
		let task1 = new Promise<void>((resolve, reject) => {
			if (this.playOpenAnimation) {
				this.playOpenAnimation(() => {
					resolve()
				})
			} else {
				resolve()
			}
		})
		let task2 = new Promise<void>((resolve, reject) => {
			if (this.audioConfigName) {
				this.loadAudioConfig(this.audioConfigName, (config) => {
					resolve()
				})
			} else {
				resolve()
			}
		})
		return Promise.all([
			task1,
			task2,
		])
	}

	/**
	 * 播放关闭动画
	 */
	playCloseAnimation?(finished: () => void): void

	/**
	 * 播放关闭动画
	 */
	playOpenAnimation?(finished: () => void): void

	private _pauseDialog() {
		console.warn("[ui] dialog pauseDialog:", this.name)

		// 停止渲染被遮蔽的对话框
		{
			this._lastOpacity = this.node._uiProps.localOpacity

			let renders = this.node.getComponentsInChildren(cc.Renderable2D)
			renders.forEach(sk => {
				(sk as any)["_enabledLast"] = sk.enabled
				sk.enabled = false
			})

			this.node._uiProps.localOpacity = 0
		}

		// this.node.active = false
	}
	private _resumeDialog() {

		// 重新启用渲染被显示的对话框
		if (this._lastOpacity !== undefined) {
			console.warn("[ui] dialog resumeDialog:", this.name)

			this.node._uiProps.localOpacity = this._lastOpacity
			this._lastOpacity = undefined

			syncOpacity(this.node)

			let renders = this.node.getComponentsInChildren(cc.Renderable2D)
			renders.forEach(sk => {
				if ((sk as any)["_enabledLast"] !== undefined) {
					if (sk.enabled) {
						console.warn("意外的enabled:", sk)
						sk.onRestore()
					} else {
						sk.enabled = (sk as any)["_enabledLast"]
					}
				}
			})

		}

		// this.node.active = true

	}

	protected _lastOpacity?: number
	private __callOnExposed() {
		this._resumeDialog()

		this.sideEffect?.onExposed()
		this.onExposed && this.onExposed()

	}

	/**
	 * 图层暴露
	 */
	// protected onExposed?(): void

	private __callOnShield() {
		this._pauseDialog()

		this.sideEffect?.onShield()
		this.onShield && this.onShield()

	}

	/**
	 * 图层被遮挡屏蔽
	 */
	protected onShield(): void {
		if (this.audioScheduleKey) {
			this.unschedule(this.audioScheduleKey)
		}
		console.warn("[ui] dialog onShield:", this.name)
		this.pauseMusics()
	}

	/**
	 * 显示对话框
	 */
	show() {
		this.layerMG.showDialog(new ShowDialogParam(this.dialogModel.uri))
	}

	private __callOnShow() {
		if (!this.dialogModel.beCovered) {
			this._resumeDialog()
		}

		this.node.emit(ICCReuse.Reuse)
		this.sideEffect?.onShow()

		console.warn("[ui] dialog onShow:", this.name)
		this.onShow && this.onShow()
	}

	/**
	 * 每次由隐藏变为显示调用
	 */
	protected onShow?(): void

	/**
	 * 强制隐藏而不关闭对话框
	 */
	hide() {
		this.layerMG.hideDialog(this.dialogModel.uri)
	}

	private __callOnHide() {
		this.sideEffect?.onHide()
		this.onHide && this.onHide()
	}

	/**
	 * 每次由显示变为隐藏调用
	 */
	protected onHide?(): void

	/**
	 * 关闭对话框
	 */
	close() {
		this.layerMG.closeDialog(this.dialogModel.uri)
	}

	private __callOnClosing() {
		this.onClosing && this.onClosing()
	}

	protected onClosing?(): void

	private __callOnClosed() {
		// console.warn("closeDialog:", this.dialogModel.uri)
		this.sideEffect?.onClosed()
		this.stopAllMusics()
		this.onClosed && this.onClosed()
	}

	/**
	 * 关闭调用
	 */
	protected onClosed?(): void

	private __callOnOpening() {
		// console.warn("recorddialog", this.layerBundle.recordBundleName, this.dialogModel.uri)
		// 记录打开的对话框
		this.layerBundle.addRecordItem(this.dialogModel.uri)
		this.onOpening && this.onOpening()
	}

	protected onOpening?(): void

	private __callOnOpened() {
		this.sideEffect?.onOpened()
		this.onOpened && this.onOpened()
	}

	// protected onOpened?(): void

	private __callOnCoverChanged() {
		this.onCoverChanged && this.onCoverChanged()
	}

	/**
	 * 顶级图层改变时调用
	 */
	protected onCoverChanged?(): void

	private __callOnAnyFocusChanged() {
		this.onAnyFocusChanged && this.onAnyFocusChanged()
	}

	/**
	 * 焦点改变时调用
	 */
	protected onAnyFocusChanged?(): void

	private __callOnBeforeDestory() {
		this.onBeforeDestroy && this.onBeforeDestroy()
		this.clearCoroutines()
		this._clearNodePool()
	}

	/**
	 * 调用对话框destory之前调用
	 */
	protected onBeforeDestroy?(): void

	/**
	 * 强制关闭并销毁对话框自身
	 * @returns
	 */
	destroySelf() {
		return LayerMG.destoryDialog(this.dialogModel)
	}

	//#region

	//#region node pool
	/**
	 * 清理使用的节点
	 */
	private _clearNodePool() {
		if (this._nodePoolMap) {
			this._nodePoolMap.clearNodePool()
		}
	}
	/**
	 * 强制销毁静态节点池
	 */
	public destroyPoolMap() {
		if (this._nodePoolMap) {
			this._nodePoolMap.destroyPoolMap()
		}
	}
	private _nodePoolMap!: CCNodePoolV2
	protected static nodePoolMapMap: CCNodePoolMapV2 = new CCNodePoolMapV2()
	get nodePoolMap() {
		if (this._nodePoolMap == null) {
			this._nodePoolMap = CCDialogComp.nodePoolMapMap.getNodePoolMap(this.dialogModel.resUri)
		}
		return this._nodePoolMap
	}
	protected getSavedKey(sample: cc.Node | cc.Prefab,) {
		let saveKey = this.nodePoolMap.getSavedKey(sample)
		return saveKey
	}
	/**
	 * 结合自带静态节点池实例化
	 * @param sample 预制体
	 * @param record 是否记录给出了哪些节点
	 * @returns
	 */
	public instantiate(sample: cc.Node | cc.Prefab, record: boolean = true) {
		let node = this.nodePoolMap.instantiate(sample, record)
		return node
	}
	/**
	 * 结合自带静态节点池回收节点
	 * @param node
	 */
	public recycleNode(node: cc.Node) {
		this.nodePoolMap.recycleNode(node)
	}
	public recycleChildren(parent: cc.Node) {
		this.nodePoolMap.recycleChildren(parent)
	}
	/**
	 * 注册预制体
	 * @param sample
	 */
	public registerPrefab(sample: cc.Node | cc.Prefab, saveKey: string, force: boolean = false) {
		this.nodePoolMap.registerPrefab(sample, saveKey, force)
	}
	//#endregion

	//#region data host
	protected integrateDataBind() {
		if (this._dataHost == null) {
			let ccDataHost = this.getComponent(CCDataHost)// ?? this.getComponentInChildren(CCDataHost)
			if (ccDataHost == undefined && this.autoAddDataHost) {
				ccDataHost = this.addComponent(CCDataHost)
				ccDataHost?.integrate()
			}
			this._dataHost = ccDataHost ?? undefined
		}
	}
	private _dataHost?: CCDataHost
	get dataHost() {
		return this._dataHost
	}

	protected autoAddDataHost: boolean = true
	/**
	 * 观测数据
	 * @param data
	 */
	observeData(data: Object, updateChildren: boolean = true): void {
		this.autoAddDataHost = true
		if (this.dataHost) {
			this.dataHost.observeData(data)
		}
	}
	//#endregion

	// #region event binding
	protected doClose() {
		this.close()
	}
	// #endregion

	//#region audio
	protected audioConfigName: string = ""
	/**
	 * 加载对话框对应的音频配置
	 * @param name
	 */
	loadAudioConfig(name?: string, onDone?: (config: TAudioSourceConfig) => void) {
		if (name) {
			this.audioConfigName = name
		} else {
			name = this.audioConfigName
		}
		AudioManager.loadAudioConfig(name, onDone)
	}
	/**
	 * 播放音效
	 * @param key
	 */
	playEffect(key: string) {
		if (this.audioConfigName) {
			let config = AudioManager.getAudioConfig(this.audioConfigName)
			config.playAudio(key, this.node)
		}
	}
	/**
	 * 播放背景音乐
	 * @param key
	 */
	playMusic(key: string) {
		if (this.audioConfigName) {
			let config = AudioManager.getAudioConfig(this.audioConfigName)
			config.playAudio(key, this.node)
		}
	}

	pauseMusics() {
		if (this.dialogModel.isOpen) {
			if (this.audioConfigName) {
				let config = AudioManager.getAudioConfig(this.audioConfigName)
				config.pauseMusics()
			}
		}
	}

	resumeMusics() {
		if (this.audioConfigName) {
			let config = AudioManager.getAudioConfig(this.audioConfigName)
			config.resumeMusics()
		}
	}

	/**
	 * 播放通用音效
	 * @param key
	 */
	playCommonEffect(key: string) {
		AudioManager.playCommonEffect(key, this.node)
	}

	/**
	 * 播放背景音乐
	 * @param key
	 */
	playMusicByIndex(index: number) {
		if (this.audioConfigName) {
			let config = AudioManager.getAudioConfig(this.audioConfigName)
			config.playAudioByIndex(index, this.node)
		}
	}

	/**
	 * 获取音效配置
	 * @returns
	 */
	getAudioConfig() {
		if (this.audioConfigName) {
			let config = AudioManager.getAudioConfig(this.audioConfigName)
			return config
		}
		return undefined
	}

	/**
	 * 停止所有背景音乐播放
	 */
	stopAllMusics() {
		if (this.audioConfigName) {
			let config = AudioManager.getAudioConfig(this.audioConfigName)
			config.stopAllMusics()
		}
	}


	protected lastAudioName: string = ""
	protected audioScheduleKey: any
	/**
	 * 随机播放背景音效
	 * @returns
	 */
	playRandomBGM() {
		if (!this.audioConfigName) {
			return
		}

		this.loadAudioConfig(undefined, (config) => {
			if (this.audioScheduleKey) {
				this.unschedule(this.audioScheduleKey)
				this.audioScheduleKey = undefined
			}
			let play = () => {
				let config = this.getAudioConfig()!
				let audios = config.musics
				let index = -1
				if (audios.length == 1) {
					index = 0
				}
				if (audios.length > 1) {
					let count = audios.length
					this.stopAllMusics()
					index = Math.floor(Math.random() * count)
				}

				if (index >= 0) {
					let audio = audios[index]
					this.lastAudioName = audio.audioName
					this.playMusic(this.lastAudioName)

					if (audios.length > 1) {
						let duration = audio.source.duration
						this.scheduleOnce(play, duration)
					}
				}

			}
			this.audioScheduleKey = play
			// let config = this.getAudioConfig()!
			// let audios = config.musics
			// if (audios.length > 1) {
			// 	this.schedule(play, 10)
			// }
			play()
		})
	}

	onOpened?(): void

	onExposed() {
		if (this.audioScheduleKey) {
			let config = this.getAudioConfig()
			if (config) {
				let audio = config.getAudio(this.lastAudioName)
				if (audio) {
					if (audio.source) {
						this.scheduleOnce(this.audioScheduleKey, audio.source.duration - audio.source.currentTime)
					}
				}
			}
		}
		console.warn("[ui] dialog onExposed:", this.name)
		this.resumeMusics()
	}

	//#endregion


	//#region UILog
	protected _logger?: lang.libs.Log
	// 使用get避免没人用浪费内存
	/**
	 * 对话框日志管理
	 */
	get logger() {
		return this._logger ?? (this._logger = UILog.clone().appendTags(["dialog", this.name]))
	}

	/**
	 * 打印普通日志
	 * @param args 
	 */
	log(...args: any[]) {
		this.logger.log(...args)
	}
	// debug(...args: any[]) {
	// 	this.logger.debug(...args)
	// }
	// info(...args: any[]) {
	// 	this.logger.info(...args)
	// }
	/**
	 * 打印警告日志
	 * @param args 
	 */
	warn(...args: any[]) {
		this.logger.warn(...args)
	}
	/**
	 * 打印错误日志
	 * @param args 
	 */
	error(...args: any[]) {
		this.logger.error(...args)
	}

	/**
	 * 播放游戏结算界面音效
	 * @param key
	 */
	playGameResultEffect(key: string) {
		AudioManager.playCommonEffect(key, this.node)
	}

	//#endregion

}

export type 对话框 = CCDialogComp
export const 对话框 = CCDialogComp

export type CCDialog = CCDialogComp
export const CCDialog = CCDialogComp

setTimeout(() => {
	CCDialogComp.sharedLayerBundle.init(LayerMG)
})
