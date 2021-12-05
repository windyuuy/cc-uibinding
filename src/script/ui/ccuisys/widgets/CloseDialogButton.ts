
import { _decorator, Component, Node, Button, EventHandler } from 'cc';
import { CCDialog } from "../CCDialogComp";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CloseDialogButton
 * DateTime = Thu Aug 26 2021 18:51:47 GMT+0800 (中国标准时间)
 * Author = windyuuy
 * FileBasename = CloseDialogButton.ts
 * FileBasenameNoExtension = CloseDialogButton
 * URL = db://assets/script/ui/core/widgets/CloseDialogButton.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('CloseDialogButton')
export class CloseDialogButton extends Component {
	@property({
		displayName: "对话框根节点",
		type: Node,
	})
	dialogRoot!: Node

	/**
	 * 获取当前组件所在节点的host
	 */
	public findDialogRoot() {
		let node: Node | null = this.node;

		try {
			while (node && node.getParent && !(node.getComponent(CCDialog))) {
				node = node.getParent ? node.getParent() : null;
			}
		} catch (error) {

		}
		return node
	}

	onLoad() {
		if (this.dialogRoot == null) {
			let root = this.findDialogRoot()
			this.dialogRoot = root!
		}
		if (this.dialogRoot) {
			let button = this.getComponent(Button)
			if (button) {
				let evt = new EventHandler()
				evt.target = this.dialogRoot
				evt.component = "CCDialogComp"
				evt.handler = "doClose"
				button.clickEvents.push(evt)
			}
		}
	}
}
