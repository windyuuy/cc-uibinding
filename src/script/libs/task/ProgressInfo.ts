
export class ProgressInfo {

	progress: number = 0;

	private _total: number = 0;
	public get total(): number {
		return this._total;
	}
	public set total(value: number) {
		this._total = value;
		this.changed = true
	}

	totalReal: number = 0;

	changed: boolean = false;

	private _doneCount: number = 0;
	public get doneCount(): number {
		return this._doneCount;
	}
	public set doneCount(value: number) {
		this.setDoneCountRaw(value)
		this.updateProgress();
	}

	setDoneCountRaw(value: number) {
		if (this._doneCount != value) {
			this.changed = true;
			this._doneCount = value;
		}
	}

	addDoneCountRaw(value: number) {
		this.setDoneCountRaw(value + this._doneCount)
	}

	updateProgress() {
		this.progress = this._doneCount / this.total;
	}

	public typeProgress() {
		console.log(`[ui] loading progress: ${this.doneCount}/${this.total}`);
	}

	public update() {
		this.changed = false;
	}
}
