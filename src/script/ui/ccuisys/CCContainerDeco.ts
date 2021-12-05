import { Component, instantiate, Node } from "cc";
import { ccclass } from "./convenient";

/**
 * 装饰容器的行为
 */
@ccclass("CCContainerDeco")
export class CCContainerDeco extends Component {
	createChildren(data: any, showCount?: number) {
		if (data instanceof Array) {
			showCount = showCount ?? data.length

			let root = this.node
			let prefab = root.children[0]
			let childCount = root.children.length;
			let idx = 0
			for (; idx < showCount; idx++) {
				let item: Node
				if (idx < childCount) {
					item = root.children[idx]
				}
				else {
					item = instantiate(prefab)
					item.setParent(root, false)
				}

				item.active = true
			}
			for (; idx < childCount; idx++) {
				root.children[idx].active = false
			}
		}
	}
}
