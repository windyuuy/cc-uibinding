import { assert, Component, Label, Node } from "cc";
import { ccclass } from "../script/ui/ccuisys/convenient";
import { CCDataHost } from "../script/ui/ccuisys/databinding/CCDataHost";

@ccclass("TestBase")
export class TestBase extends Component {

	//#region data host
	protected integrateDataBind() {
		if (this._dataHost == null) {
			let ccDataHost = this.getComponent(CCDataHost)// ?? this.getComponentInChildren(CCDataHost)
			if (ccDataHost == undefined && this.autoAddDataHost) {
				ccDataHost = this.addComponent(CCDataHost)
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

	get data() {
		return (this as any)["rawData"]
	}
	onLoad() {
		(window as any)["test1"] = this;
		this.integrateDataBind()

		this.observeData(this.data)
	}

	start() {
		// this.scheduleOnce(() => {
		this.test()
		// }, 0.2)
	}

	test() {
	}

	tick() {
		vm.Tick.next()
	}

	update() {
		this.tick()
	}

}
