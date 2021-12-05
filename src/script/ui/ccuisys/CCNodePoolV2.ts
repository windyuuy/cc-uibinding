/*
 * @Author: your name
 * @Date: 2021-08-25 18:54:29
 * @LastEditTime: 2021-08-25 19:10:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\script\ui\core\CCNodePoolV2.ts
 */

import * as cc from "cc"
import { EmptyTable } from "./basic"

export class CCNodePoolV2 {

	/**
	 * 清理使用的节点
	 */
	public clearNodePool() {
		while (this.givenNodes.length > 0) {
			let node = this.givenNodes.pop()
			if (node && cc.isValid(node, true)) {
				node.parent = null
				this.recycleNode(node)
			}
		}
	}
	/**
	 * 强制销毁静态节点池
	 */
	public destroyPoolMap() {
		if (this._nodePoolMap) {
			for (let key in this._nodePoolMap) {
				let nodePool = this._nodePoolMap[key]
				nodePool.clear()
			}
			for (let key in this._nodePoolMap) {
				delete this._nodePoolMap[key]
			}
		}
	}
	private static NodeSaveKey = "mynodename"
	private givenNodes: cc.Node[] = []
	private _nodePoolMap: { [key: string]: cc.NodePool } = EmptyTable()
	get nodePoolMap() {
		return this._nodePoolMap
	}

	public resUri!: string

	public getSavedKey(sample: cc.Node | cc.Prefab,) {
		let saveKey: string
		if (sample instanceof cc.Prefab) {
			saveKey = sample.data[CCNodePoolV2.NodeSaveKey]
			if (saveKey === undefined) {
				saveKey = `${sample.data.name}`
			}
			sample.data[CCNodePoolV2.NodeSaveKey] = saveKey
		} else {
			saveKey = (sample as any)[CCNodePoolV2.NodeSaveKey]
			if (saveKey === undefined) {
				saveKey = `${sample.name}`
			};
			(sample as any)[CCNodePoolV2.NodeSaveKey] = saveKey;
		}
		return saveKey
	}
	/**
	 * 结合自带静态节点池实例化
	 * @param sample 预制体
	 * @param record 是否记录给出了哪些节点
	 * @returns
	 */
	public instantiate(sample: cc.Node | cc.Prefab, record: boolean = true) {
		let saveKey: string = this.getSavedKey(sample)

		let nodePool = this.nodePoolMap[saveKey]
		if (nodePool == undefined) {
			nodePool = this.nodePoolMap[saveKey] = new cc.NodePool()
		}
		let node = nodePool.get()
		if (node == undefined) {
			node = cc.instantiate(sample) as cc.Node
			(node as any)[CCNodePoolV2.NodeSaveKey] = saveKey
		} else {
			{
				let anim = node.getComponent(cc.Animation)
				if (anim) {
					// if (anim.playOnLoad && anim.enabled) {
					// 	let isPlaying = !!anim.clips.find(c => anim!.getState(c!.name).isPlaying)
					// 	if (!isPlaying) {
					// 		anim!.play()
					// 	}
					// }
					for (let clip of anim.clips) {
						if (clip) {
							let state = anim.getState(clip.name)
							if (state) {
								state.speed = 1
							}
						}
					}
				}
			}
		}
		if (record) {
			this.givenNodes.push(node)
		}

		return node
	}
	/**
	 * 结合自带静态节点池回收节点
	 * @param node
	 */
	public recycleNode(node: cc.Node) {
		let saveKey = (node as any)[CCNodePoolV2.NodeSaveKey];
		let nodePool = this.nodePoolMap[saveKey]
		if (nodePool == undefined) {
			nodePool = this.nodePoolMap[saveKey] = new cc.NodePool()
		}

		{
			let anim = node.getComponent(cc.Animation)
			if (anim) {
				anim.stop()
			}
		}

		nodePool.put(node)
		this.givenNodes.remove(node)
	}
	public recycleChildren(parent: cc.Node) {
		for (let node of parent.children.concat()) {
			if (node) {
				this.recycleNode(node)
			}
		}
	}
	/**
	 * 注册预制体
	 * @param sample
	 */
	public registerPrefab(sample: cc.Node | cc.Prefab, saveKey: string, force: boolean = false) {
		let saveKey0 = this.getSavedKey(sample)
		if (saveKey0 == null || force) {
			if (sample instanceof cc.Prefab) {
				sample.data[CCNodePoolV2.NodeSaveKey] = saveKey
			} else {
				(sample as any)[CCNodePoolV2.NodeSaveKey] = saveKey;
			}
		} else {
			if (saveKey0) {
				console.warn(`conflict saveKey: ${saveKey0} -> ${saveKey}`)
			}
		}
	}

}

export class CCNodePoolMapV2 {
	private nodePoolMapMap: { [key: string]: CCNodePoolV2 } = EmptyTable()

	public getNodePoolMap(resUri: string): CCNodePoolV2 {
		let nodePoolMap = this.nodePoolMapMap[resUri]
		if (nodePoolMap == null) {
			nodePoolMap = this.nodePoolMapMap[resUri] = new CCNodePoolV2()
		}
		return nodePoolMap;
	}
}

