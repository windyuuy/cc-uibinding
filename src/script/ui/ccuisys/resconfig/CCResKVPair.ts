// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import * as cc from "cc"
import { IResKVPair } from "./IResConfig";
const { ccclass, property, } = cc._decorator;

/**
 * 资源配置-键值对
 */
@ccclass('CCResKVPair')
export class CCResKVPair implements IResKVPair {
    @property({ displayName: "引用资源" })
    key: string = ""

    @property({ displayName: "资源", type: cc.Prefab })
    value!: cc.Prefab;

    @property({ displayName: "分组" })
    group: string = "";

}
