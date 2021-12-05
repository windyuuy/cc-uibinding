import { AudioSource } from "cc";

export class AudioSourceB extends AudioSource {

	// 重载默认的 onEnable, 阻止默认的 playOnload
	public onEnable() {
		// audio source component may be played before
		// this.scheduleOnce(() => {
		// 	if (this._playOnAwake && !this.playing) {
		// 		this.play();
		// 	}
		// })
	}

}
