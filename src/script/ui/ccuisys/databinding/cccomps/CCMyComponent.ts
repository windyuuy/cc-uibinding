import { Component } from "cc";
import { ccclass } from "../../convenient";

@ccclass("CCMyComponent")
export class CCMyComponent extends Component {

	protected static _creatingList: CCMyComponent[] = []
	protected _isCreating: boolean = this.markCreating()
	protected markCreating() {
		CCMyComponent._creatingList.push(this)
		return true
	}

	_deleteAttr(attr: keyof this) {
		delete (this as any)[attr]
	}

	protected onPreDestroy() {

	}

	_onPreDestroy() {
		this._isCreating = false
		this.onPreDestroy()
		super._onPreDestroy && super._onPreDestroy()
	}

	onCreate?() {
		this.onPreload()
	}
	protected __preload() {
		if (this._isCreating) {
			this.onPreload()
		}
	}

	protected onPreload() {

	}

}
