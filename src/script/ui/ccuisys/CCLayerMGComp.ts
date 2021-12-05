
import * as cc from "cc"
import { MyNodePool } from "../../game/resmg/MyNodePool";
const { ccclass, property, menu } = cc._decorator;

@ccclass('LayerMGComp')
export class LayerMGComp extends cc.Component {
	@property(cc.Node)
	public layerRoot!: cc.Node
	@property(cc.Prefab)
	public modalPrefab!: cc.Prefab
	@property(cc.Prefab)
	public toastPrefab!: cc.Prefab
	@property(cc.Prefab)
	public loadingViewPrefab!: cc.Prefab
	public loadingViewNode!: cc.Node
	@property(cc.Prefab)
	public sureDialogPrefab!: cc.Prefab
	@property(cc.Camera)
	public uiCamera!: cc.Camera

	public toastPrefabUrl: string = "gcc.layer:toast"

	public static inst: LayerMGComp

	public onLayerChange: (() => void)[] = []

	public onLoad() {
		LayerMGComp.inst = this;
		if (this.layerRoot == null && cc.isValid(this, true)) {
			this.layerRoot = this.node
		}
		MyNodePool.registerPrefab(this.toastPrefabUrl, this.toastPrefab)

		let loadingViewNode = cc.instantiate(this.loadingViewPrefab)
		loadingViewNode.active = false
		loadingViewNode.parent = this.node
		this.loadingViewNode = loadingViewNode

		cc.game.addPersistRootNode(this.node)
	}

	update() {
		vm.Tick.next();
	}

}
