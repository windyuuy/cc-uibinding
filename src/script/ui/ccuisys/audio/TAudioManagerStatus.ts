import { CCAudioSource } from "../../ccomps/CCAudioSource"

export class TAudioManagerStatus {
	playingMusics: CCAudioSource[] = []

	addMusic(audio: CCAudioSource) {
		if (this.playingMusics.indexOf(audio) < 0) {
			this.playingMusics.push(audio)
		}
	}

	setMusicVolume(volume: number) {
		this.playingMusics.forEach(m => {
			m.source.volume = volume
		})
	}

	muteAllMusicsInPlaylist() {
		this.playingMusics.forEach(m => {
			m.mute()
		})
	}

	unmuteAllMusicsInPlaylist() {
		this.playingMusics.forEach(m => {
			m.unmute()
		})
	}
}

export const AudioManagerStatus = new TAudioManagerStatus()
