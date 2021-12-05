// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import * as cc from "cc"
import { CCResKVPair } from "./CCResKVPair";
const { ccclass, property, menu } = cc._decorator;

/**
 * 资源清单
 */
@ccclass('CCResConfig')
@menu("gcc/Res/CCResConfig")
export class CCResConfig extends cc.Component {

    @property({
        type: [CCResKVPair],
        tooltip: '预制体清单',
    })
    public resList: CCResKVPair[] = [];

}

/**
 * 资源配置项信息
 */
export type TResMap = { [key: string]: CCResKVPair }

/**
 * 资源uri配置
 */
export interface ResConfigURI {
    configPath: string
    indexKey: string | null
}
