
export class TaskInfo {
	task!: Promise<any>
	name!: string
	isComplete = false

	setTaskInfo(task: Promise<any>, name: string) {
		this.task = task
		this.name = name
		task.then(() => {
			this.isComplete = true
		}, () => { })
	}
}
