import { TaskInfo } from "./TaskInfo";
import { ProgressInfo } from "./ProgressInfo";
import { PPromise } from "../../ui/ccuisys/basic";

/**
 * 批量异步任务管理
 */
export class ReadableTaskBatch {
	protected tasks: Promise<any>[] = [];
	protected tasksInfo: TaskInfo[] = [];
	protected initProgressTasks: Promise<void>[] = [];
	protected isInitProgressTasksDone: boolean = false

	progress: ProgressInfo = new ProgressInfo();

	addTask(name: string, task: Promise<any>) {
		this.tasks.push(task);

		let info = new TaskInfo();
		info.setTaskInfo(task, name);
		this.tasksInfo.push(info);

		this.isInitProgressTasksDone = false
		let initProgressTask = new Promise<void>((resolve, reject) => {
			let task1 = task as PPromise<void>
			if (task1.isWithProgress) {
				task1.onProgress((c, t, diff, tdiff, isFrist) => {
					// this.progress.doneCount += diff
					this.addDoneCount(diff, tdiff)
					if (isFrist) {
						this.progress.total += t
					}
				})
				task1.then(() => {
					resolve()
				})
			} else {
				task.then(() => {
					// this.progress.doneCount++;
					this.addDoneCount(1, 1)
					resolve()
				});
				this.progress.total++;
			}
		})
		this.initProgressTasks.push(initProgressTask)
		return initProgressTask
	}

	addDoneCount(diff: number, tdiff: number) {
		this.progress.totalReal += tdiff
		this.progress.total = Math.max(this.progress.totalReal, this.doneCountMin)
		// if (this.isInitProgressTasksDone) {
		this.progress.doneCount += diff
		// } else {
		// this.progress.addDoneCountRaw(diff)
		// }
	}

	protected doneCountMin: number = 0
	/**
	 * 等待进度初始化完毕
	 * @returns
	 */
	waitProgressInit(doneCountMin: number = 0): Promise<void[]> {
		this.doneCountMin = doneCountMin
		let task = Promise.all(this.initProgressTasks)
		task.then(() => {
			this.isInitProgressTasksDone = true
			this.progress.total = this.progress.totalReal
			this.progress.setDoneCountRaw(this.progress.totalReal)
			this.progress.updateProgress()
		})
		return task
	}

	/**
	 * 获取未完成的任务
	 */
	getPendingTasks() {
		let tasks = this.tasksInfo.filter(taskInfo => !taskInfo.isComplete).map(taskInfo => taskInfo.task);
		return tasks
	}

	/**
	 * 打印未完成的任务
	 */
	typePendingTasks(tip: string) {
		console.error(tip);
		for (let taskInfo of this.tasksInfo) {
			if (!taskInfo.isComplete) {
				console.warn(`[pending-timeout-task] task<${taskInfo.name}>`);
			}
		}
	}
}
