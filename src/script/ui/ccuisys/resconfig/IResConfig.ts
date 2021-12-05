
import * as cc from "cc"

/**
 * 资源配置-键值对
 */
export interface IResKVPair {
	/**
	 * 资源唯一Key
	 */
	key: string
	/**
	 * 资源对象
	 */
	value: cc.Prefab
	/**
	 * 资源分组
	 */
	group: string
}

/**
 * 资源配置管理接口
 */
export interface ITResConfigManager {
	/**
	* 通过uri获取资源
	* - 格式: 预制体相对路径:资源key
	* - 相对路径: db://assets/resources/prefabs/game/config/
	* @param uri
	*/
	find(uri: string): IResKVPair

	/**
	 * 通过uri获取资源组
	 * @param uri 
	 */
	findGroup(uri: string): IResKVPair[]
}
