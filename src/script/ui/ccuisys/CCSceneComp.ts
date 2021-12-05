import { ccclass, property } from "./convenient";
import { CCDialogComp } from "./CCDialogComp";
import { BlockInputEvents, tiledLayerAssembler } from "cc";
import { IDialogDelegate } from "./ICCDialog";
import { LayerBundle, ShowDialogParam } from "./basic";

/**
 * 处理场景附加业务
 */
export class SceneDelegate implements IDialogDelegate {
	scene!: CCSceneComp
	layerBundle!: LayerBundle
	init(scene: CCSceneComp, layerBundle: LayerBundle) {
		this.scene = scene
		this.layerBundle = layerBundle
		return this
	}

	onOpened(): void {
		this.layerBundle.setRecordBundle(this.scene["dynamicBundleName"])
		const currentScenes = CCSceneComp["currentScenes"]
		currentScenes.remove(this.scene)
		currentScenes.unshift(this.scene)
	}
	onClosed(): void {
		// console.warn("pop dialog recordbundle")
		this.layerBundle.closeRecordBundle()
		this.layerBundle.getRecordBundle().clear()
		const currentScenes = CCSceneComp["currentScenes"]
		currentScenes.remove(this.scene)
		let curScene = currentScenes[0]
		if (curScene) {
			this.layerBundle.setRecordBundle(curScene["dynamicBundleName"])
		} else {
			this.layerBundle.setRecordBundle(gcc.layer.DefaultBundleName)
		}
	}
	onShow(): void {
	}
	onHide(): void {
	}

	onExposed(): void {
	}
	onShield(): void {
	}
}

/**
 * 对话框基类
 */
@ccclass("CCSceneComp")
export class CCSceneComp extends CCDialogComp {

	/**
	 * 当前场景
	 */
	protected static currentScenes: CCSceneComp[] = []
	/**
	 * 获取当前场景
	 */
	static getCurrentScene(): CCSceneComp | undefined {
		return this.currentScenes[0]
	}

	protected sideEffect: SceneDelegate = new SceneDelegate()

	protected onCreate(data?: Object) {
		this.dialogModel.isCover = true
		this.sideEffect.init(this, this.layerBundle)
		super.onCreate(data)
	}

	protected get dynamicBundleName() {
		let bundleName = this.dialogModel.uri
		return `${bundleName}$DynBundle`
	}

}

export type CCScene = CCSceneComp
export const CCScene = CCSceneComp
