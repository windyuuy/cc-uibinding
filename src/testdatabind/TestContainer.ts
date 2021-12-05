import { assert, Component, Label, Node } from "cc";
import { ccclass } from "../script/ui/ccuisys/convenient";
import { TestBase } from "./TestBase";

@ccclass("TestContainer")
export class TestContainer extends TestBase {

    rawData = {
        C1: [
            {
                C2: [
                    {
                        QQ: "QQ",
                        pp: "PP",
                    },
                    {
                        QQ: "QQ2",
                        pp: "PP2",
                    },
                ],
            },
            {
                C2: [
                    {
                        QQ: "QQ3",
                        pp: "PP3",
                    },
                    {
                        QQ: "QQ4",
                        pp: "PP4",
                    },
                ],
            },
        ]
    }

    test() {
        let C1 = this.cn("c")!
        let items = C1.getComponentsInChildren(Label)
        assert(items[0].string == this.rawData.C1[0].C2[0].QQ)
        assert(items[7].string == this.rawData.C1[1].C2[1].pp)
        let Node0 = C1.cns("Node")[0]
        let Node1 = C1.cns("Node")[1]
        Node1.parent = null
        let sample0 = this.rawData.C1[1].C2[0].QQ
        let sample1 = "jjj"
        this.rawData.C1[1].C2[0].QQ = sample1
        this.tick()
        assert(items[4].string == sample0)
        Node1.parent = C1
        this.tick()
        assert(items[4].string == sample1)
        this.rawData.C1.push({
            C2: [
                {
                    QQ: "QQ5",
                    pp: "pp5",
                },
                {
                    QQ: "QQ6",
                    pp: "pp6",
                },
            ],
        })
        this.rawData.C1.push({
            C2: [
                {
                    QQ: "QQ7",
                    pp: "pp7",
                },
                {
                    QQ: "QQ8",
                    pp: "pp8",
                },
            ],
        })
        this.rawData.C1[1].C2.push({
            QQ: "QQX1",
            pp: "ppx1",
        })
        this.tick()
        items = C1.getComponentsInChildren(Label)
        assert(items[9].string == this.rawData.C1[1].C2[2].pp)
        assert(items[17].string == this.rawData.C1[3].C2[1].pp)
        this.tick()
        this.rawData.C1.removeAt(1)
        this.tick()
        this.rawData.C1.removeAt(0)
        this.tick()
        this.rawData.C1[0].C2.removeAt(2)
        this.tick()
        items = C1.getComponentsInChildren(Label)
        assert(items.length == 18)
        items = items.filter(item => item.enabledInHierarchy)
        assert(items.length == 8)

        let sample2 = this.rawData.C1[1].C2[0].QQ
        Node1 = C1.cns("Node")[1]
        Node1.parent = null
        this.tick()
        this.rawData.C1[1].C2[0].QQ = "sample31"
        this.tick()
        this.rawData.C1[1].C2[0].QQ = "sample32"
        this.tick()
        this.rawData.C1[1].C2[0].QQ = "sample33"
        this.tick()
        let sample3 = "jjjxx"
        this.rawData.C1[1].C2[0].QQ = sample3
        this.tick()
        assert(items[4].string == sample2)
        Node1.parent = C1
        this.tick()
        assert(items[4].string == sample3)

    }

}
