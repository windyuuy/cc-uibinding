import { instantiate, Component, Node } from "cc";
import { EmptyTable } from "./basic";
import { CCContainerDeco } from "./CCContainerDeco";
import { CCContainerBinding } from "./databinding/CCContainerBinding";
import { CCDialogChild } from "./databinding/CCDialogChild";
import { ICCDialog } from "./ICCDialog";

export class UICoreUtils {

	/**
	 * 更新容器
	 * @param listHost
	 * @param root
	 * @param data
	 * @param itemDatas
	 * @param cls
	 * @param updateFunc
	 */
	public static updateContainer(root: Node, showCount: number,
		updateFunc?: (item: Node, index: number) => void,
		initChildren?: () => void
	) {
		if (initChildren) {
			initChildren()
		} else {
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
		if (updateFunc != null) {
			for (let i = 0; i < showCount; i++) {
				updateFunc(root.children[i], i);
			}
		}
	}

	/**
	 * 更新容器子项数据绑定
	 * @param listHost
	 * @param root
	 * @param data
	 * @param itemDatas
	 * @param cls
	 * @param updateFunc
	 */
	public static updateContainerDataBinding<T extends CCDialogChild>(
		container: CCContainerBinding, dialog: ICCDialog,
		listHost: Object | Component, root: Node, data: any, itemDatas: Object[],
		cls?: (new (name?: string | undefined) => T),
		updateFunc?: (item: Node, index: number) => void,
		otherFunc?: (item: Node, index: number) => void) {

		if (cls == undefined) {
			cls = CCDialogChild as any
		}
		if (listHost instanceof Component) {
			listHost = (listHost as any)["_childrenDataBindCache"] = EmptyTable()
		}
		let saveKey = root.name
		let compsCache = (listHost as any)[saveKey] ?? ((listHost as any)[saveKey] = [])
		let initChildrenFunc: (() => void) | undefined
		let containerDecoComp = container.getComponent(CCDialogChild)
		if (containerDecoComp && containerDecoComp.onCreateChildren) {
			initChildrenFunc = () => {
				if (containerDecoComp?.onCreateChildren) {
					containerDecoComp?.onCreateChildren(itemDatas, itemDatas.length)
				}
			}
		}
		this.updateContainer(root, itemDatas.length, (node, index) => {
			let comp: CCDialogChild = compsCache[index] ?? (compsCache[index] = node.getComponent(cls as any))
			if (comp) {
				// comp.initWithDialog(dialog, true)
				comp.observeData(itemDatas[index])
				updateFunc && updateFunc(node, index)
			} else {
				otherFunc && otherFunc(node, index)
			}
		}, initChildrenFunc)
	}

}
