
import * as cc from "cc"
const { ccclass, property, integer } = cc._decorator;

/**
 * 提示正在加载中
 */
@ccclass('UILoading')
export class UILoading extends cc.Component {

	@property(cc.Animation)
	anim!: cc.Animation

	@integer
	public confDelay: number = 1

	@integer
	public timeout: number = 10

	private loadingCount: number = 0;

	private timerTimeout: any

	public show() {

		this.loadingCount++;
		if (this.loadingCount == 1) {
			this.node.active = true;
			this.anim.node.active = false
			this.scheduleOnce(this.showAnim.bind(this), this.confDelay);
		}

		if (this.timerTimeout == null) {
			this.timerTimeout = this.onTimeout.bind(this)
		}
		this.unschedule(this.timerTimeout)
		this.scheduleOnce(this.timerTimeout, this.timeout)
	}

	protected onTimeout() {
		this.stopAnim()
	}

	private showAnim() {
		this.anim.node.active = true
		this.anim.play()
	}

	private stopAnim() {
		this.unschedule(this.timerTimeout)
		this.unscheduleAllCallbacks()
		this.anim.stop()
		this.node.active = false;
	}

	public hide() {
		this.loadingCount--;
		if (this.loadingCount == 0) {
			this.stopAnim()
		}
	}

	public close() {
		this.hide()
	}
}
