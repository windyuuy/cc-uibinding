
import { _decorator, Component, Node, Vec3, UITransform, size, Vec2, math } from 'cc';
import { executeInEditMode } from "../convenient";
import { Size2 } from "../Vector";
const { ccclass, property } = _decorator;

@ccclass('CCSizeProgress')
@executeInEditMode
export class CCSizeProgress extends Component {

	@property({
		slide: true,
		max: 1,
		min: 0,
		step: 0.01,
	})
	protected _progress: number = 0

	@property({
		slide: true,
		max: 1,
		min: 0,
		step: 0.01,
	})
	get progress() {
		return this._progress
	}

	set progress(value: number) {
		this._progress = value

		this.updateSize()
	}

	@property
	private _maxValue: number = 40;

	@property
	public get maxValue(): number {
		return this._maxValue;
	}
	public set maxValue(value: number) {
		this._maxValue = value;

		this.updateSize()
	}

	protected initSize: math.Size = new math.Size()
	protected curSize: math.Size = new math.Size()
	// protected uiTransform!: UITransform

	onLoad() {
		// this.uiTransform = this.getComponent(UITransform)!
		let size0 = this.uiTransform!.contentSize
		if (size0) {
			this.initSize.set(size0.width, size0.height)
			this.curSize.set(this.initSize)
		}
	}

	protected updateSize() {
		let maxValue = this.maxValue
		if (maxValue == -1) {
			maxValue = this.initSize.height
		}
		this.curSize.height = maxValue * this._progress
		this.uiTransform!.setContentSize(this.curSize)
	}
}
