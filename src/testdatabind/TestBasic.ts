import { assert, Component, Label, Node } from "cc";
import { ccclass } from "../script/ui/ccuisys/convenient";
import { TestBase } from "./TestBase";

@ccclass("TestBasic")
export class TestBasic extends TestBase {

    //#endregion

    rawData = {
        kk: "kjkj",
    }

    test() {
        let cct = gcc.cct.cctyper
        cct.all

        // case 1
        this.tick()
        let labelNode = cct.findNodeByName("Label") as Node
        let label = labelNode.getComponent(Label)!
        let sample1 = "hello"
        this.rawData.kk = sample1
        this.tick()
        assert(this.rawData.kk == label.string)
        cct.findNodeByName("Node4").parent = null
        let sample2 = "hello2"
        this.rawData.kk = sample2
        this.tick()
        assert(label.string == sample2)
        cct.findNodeByName("Node4").parent = cct.findNodeByName("Node2")
        let sample3 = "hello3"
        this.rawData.kk = sample3
        this.tick()
        assert(label.string == sample3)
        let parent0 = labelNode.parent
        labelNode.parent = null
        this.rawData.kk = "hello5"
        this.tick()
        assert(label.string == sample3)
        labelNode.parent = parent0
        assert(label.string == "hello5")

        label.string = "done"
    }

}
