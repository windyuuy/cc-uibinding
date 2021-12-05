
import { EDITOR } from "cc/env"

/**
 * 游戏UI日志
 */
export let UILog!: lang.libs.Log
/**
 * 游戏日志
 */
export let GameLog!: lang.libs.Log
/**
 * 游戏服日志
 */
export let NetGameLog!: lang.libs.Log
/**
 * 网络日志
 */
export let NetLog!: lang.libs.Log
/**
 * 自己玩家日志
 */
export let SelfLog!: lang.libs.Log
/**
 * 自己玩家网络日志
 */
export let SelfNetLog!: lang.libs.Log
/**
 * 玩家日志
 */
export let PlayerLog!: lang.libs.Log

if (!EDITOR) {
	try {
		UILog = new lang.libs.Log({
			tags: ["ui"],
		})
		GameLog = new lang.libs.Log({
			tags: ["fight"],
		})
		NetGameLog = new lang.libs.Log({
			tags: ["network", "fight"],
			time: true,
		})
		NetLog = new lang.libs.Log({
			tags: ["network"],
			time: true,
		})
		SelfLog = new lang.libs.Log({
			tags: ["fight", "player", "self"],
		})
		SelfNetLog = new lang.libs.Log({
			tags: ["network", "player", "self"],
			time: true,
		})
		PlayerLog = new lang.libs.Log({
			tags: ["fight", "player", "self"],
		})
	} catch (e) {
		console.error("load lib failed - lib<lang>.")
	}
}
