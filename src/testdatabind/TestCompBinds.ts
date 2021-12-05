import { assert, Button, Label, Node, ProgressBar, Sprite, Toggle } from "cc";
import { ccclass } from "../script/ui/ccuisys/convenient";
import { CCButtonBind } from "../script/ui/ccuisys/databinding/CCButtonBind";
import { CCSimpleBind } from "../script/ui/ccuisys/databinding/CCSimpleBind";
import { TestBase } from "./TestBase";

@ccclass("TestCompBinds")
export class TestCompBinds extends TestBase {

	rawData = {
		enabled: false,
		gray: false,
		doClick: function () {
			console.log("click", this)
		},
		label: "hello",
		spriteUrl: "textures/ui/common/pack/pop_btn_closed",
		visible: false,
		progress: 0,
		isToggleCheck: false,
	}

	test() {
		let BtnBind = this.cn("Button")!.getComponent(CCButtonBind)!
		let Btn = BtnBind.target!
		this.rawData.enabled = true
		this.tick()
		assert(Btn.interactable == this.rawData.enabled)
		this.rawData.gray = true
		this.tick()
		assert(BtnBind.isGray == this.rawData.gray)

		let LabelBind = this.cn("Label")!.getComponent(CCSimpleBind)!
		let Label0 = LabelBind.target as Label
		assert(Label0.string == this.rawData.label)
		this.rawData.label = "jkkjkfje"
		this.tick()
		assert(Label0.string == this.rawData.label)

		let SpriteBind = this.cn("Sprite")!.getComponent(CCSimpleBind)!
		let Sprite0 = SpriteBind.target as Sprite
		assert(SpriteBind.spriteTextureUrl == this.rawData.spriteUrl)
		this.rawData.spriteUrl = "textures/ui/common/pack/pop_btn_closed"
		this.tick()
		assert(SpriteBind.spriteTextureUrl == this.rawData.spriteUrl)
		this.rawData.spriteUrl = ""
		this.tick()
		assert(Sprite0.spriteFrame == null)
		this.rawData.spriteUrl = "textures/ui/common/pack/pop_btn_closed"
		this.tick()
		assert(SpriteBind.spriteTextureUrl == this.rawData.spriteUrl)

		this.tick()
		let VisibleBind = this.cn("Visible")!.getComponent(CCSimpleBind)!
		let Visible0 = VisibleBind.node
		assert(Visible0.active == this.rawData.visible)
		this.rawData.visible = true
		this.tick()
		assert(Visible0.active == this.rawData.visible)
		this.rawData.visible = false
		this.tick()
		// @ts-ignore
		assert(Visible0.active == this.rawData.visible)
		this.rawData.visible = true
		this.tick()
		assert(Visible0.active == this.rawData.visible)

		let ProgressBind = this.cn("ProgressBar")!.getComponent(CCSimpleBind)!
		let Progress0 = ProgressBind.target as ProgressBar
		assert(Progress0.progress == this.rawData.progress)
		this.rawData.progress = 1
		this.tick()
		assert(Progress0.progress == this.rawData.progress)

		let ToggleBind = this.cn("Toggle")!.getComponent(CCSimpleBind)!
		let Toggle0 = ToggleBind.target as Toggle
		assert(Toggle0.isChecked == this.rawData.isToggleCheck)
		this.rawData.isToggleCheck = !this.rawData.isToggleCheck
		this.tick()
		assert(Toggle0.isChecked == this.rawData.isToggleCheck)

	}

}
