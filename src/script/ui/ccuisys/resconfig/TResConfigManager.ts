import * as cc from "cc";
import { CCResKVPair } from "./CCResKVPair";
import { IResKVPair, ITResConfigManager } from "./IResConfig";
import { TResMap, CCResConfig, ResConfigURI } from "./CCResConfig";
import { EmptyTable } from "../basic";

/**
 * 配置管理器
 */

export class TResConfigManager implements ITResConfigManager {
	static configCache: { [key: string]: TResMap; } = EmptyTable();

	protected getConfig(configPath: string) {
		let resConfigs = TResConfigManager.configCache[configPath];
		if (resConfigs == null) {
			resConfigs = fsync.EmptyTable();
			TResConfigManager.configCache[configPath] = resConfigs;

			let prefab = cc.resources.get(`prefabs/game/config/${configPath}`, cc.Prefab)!;
			let node = prefab.data as cc.Node;
			let configs: CCResConfig[] = node.getComponentsInChildren(CCResConfig);
			// {
			//     let config = node.getComponent(CCResConfig)
			//     if (config) {
			//         configs.unshift(config)
			//     }
			// }
			for (let config of configs) {
				for (let res of config.resList) {
					resConfigs[res.key] = res;
				}
			}
		}

		return resConfigs;
	}

	protected parseUri(uri: string): ResConfigURI {
		let configPath = "defaultConfig";
		let indexKey: string | null = null;
		if (uri.indexOf(":") >= 0) {
			let lines = uri.split(":");
			configPath = lines[0];
			indexKey = lines[1];
		} else {
			if (uri.indexOf("/") >= 0) {
				configPath = uri;
			} else {
				indexKey = uri;
			}
		}
		return {
			configPath,
			indexKey,
		};
	}

	/**
	 * 按照uri获取单个目标资源
	 * @param uri
	 */
	find(uri: string): IResKVPair {
		let uriInfo = this.parseUri(uri);

		let resConfigs = this.getConfig(uriInfo.configPath);
		let resValue = resConfigs[uriInfo.indexKey!];
		if (resValue == null) {
			console.warn(`res not found: ${uri}`);
		}
		if (!(resValue instanceof cc.Prefab)) {
			console.warn(`res format invalid: ${uri}`, resValue);
		}

		return resValue;
	}

	/**
	 * 按照uri获取单组资源
	 * @param uri
	 */
	findGroup(uri: string): IResKVPair[] {
		let uriInfo = this.parseUri(uri);

		let resValues: CCResKVPair[] = [];
		let resConfigs = this.getConfig(uriInfo.configPath);
		let groupName = uriInfo.indexKey;
		for (let key in resConfigs) {
			let value = resConfigs[key];
			if (value.group == groupName) {
				resValues.push(value);
			}
		}

		return resValues;
	}
}
