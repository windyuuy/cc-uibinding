import { assert, Component, Label, Node } from "cc";
import { ccclass } from "../script/ui/ccuisys/convenient";
import { CCDialogChild } from "../script/ui/ccuisys/databinding/CCDialogChild";
import { TestBase } from "./TestBase";

@ccclass("TestDialogChild")
export class TestDialogChild extends TestBase {

    rawData = {
        C1: {
            AV2: "AAA",
        }
    }

    rawData2 = {
        AV2: "BBB",
    }

    rawData3 = {
        C1: {
            AV2: "CCC",
        }
    }

    test() {
        this.testCustomData()
        this.testAutoBind()
        this.testAutoBindSubKey()
    }

    testCustomData() {
        let CustomDataNode = this.cn("CustomData")!
        let label = CustomDataNode.cn("Label")?.getComponent(Label)!
        let ccDialogChild = CustomDataNode.getComponent(CCDialogChild)!
        assert(label.string == "label")
        this.tick()
        assert(label.string == "label")
        ccDialogChild.observeData(this.rawData2)
        this.tick()
        assert(label.string == this.rawData2.AV2)
    }

    testAutoBindSubKey() {
        let AutoBindSubKeyNode = this.cn("AutoBindSubKey")!
        let label = AutoBindSubKeyNode.cn("Label")?.getComponent(Label)!
        this.tick()
        assert(label.string == this.rawData.C1.AV2)
        this.observeData(this.rawData3)
        this.tick()
        assert(label.string == this.rawData3.C1.AV2)
    }

    testAutoBind() {
        let AutoBindNode = this.cn("AutoBind")!
        let label = AutoBindNode.cn("Label")?.getComponent(Label)!
        let ccDialogChild = AutoBindNode.getComponent(CCDialogChild)!
        this.tick()
        assert(label.string == this.rawData.C1.AV2)
        ccDialogChild.observeData(this.rawData3)
        this.tick()
        assert(label.string == this.rawData3.C1.AV2)
    }

}
