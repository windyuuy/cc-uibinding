import { LayerMGComp } from "./CCLayerMGComp";
import { UILoading } from "./CCUILoading";

export class LoadingHandler implements gcc.layer.ILoadingHandler {
	protected loadingView!: UILoading
	init() {
		this.loadingView = LayerMGComp.inst.node.getChildByName("DUILoading")?.getComponent(UILoading)!
		return this
	}

	onShowLoading?(): any {
		this.loadingView.show()
	}
	onHideLoading?(): any {
		this.loadingView.hide()
	}
	onCloseLoading?(): any {
		this.loadingView.close()
	}
}

