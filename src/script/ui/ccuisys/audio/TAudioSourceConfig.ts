/*
 * @Author: your name
 * @Date: 2021-09-13 12:00:22
 * @LastEditTime: 2021-09-13 15:26:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\script\ui\ccuisys\audio\TAudioSourceConfig.ts
 */
import { Node } from "cc";
import { CCAudioSource } from "../../ccomps/CCAudioSource";
import { EmptyTable, TStrMap } from "../basic";
import { AudioSourceB } from "./AudioSource2";
import { AudioUserConfig } from "./TAudioUserConfig";
import { AudioManagerStatus } from "./TAudioManagerStatus";
import * as cc from "cc";
import { CoBindInfo } from "../Coroutine";

/**
 * 音效配置
 */
export class TAudioSourceConfig {
	protected onLoadingTask?: Promise<void>;
	protected notifyLoaded?: Function;
	/**
	 * 配置是否已加载完成
	 */
	isLoaded: boolean = false;
	constructor() {
		this.onLoadingTask = new Promise((resolve, reject) => {
			this.notifyLoaded = resolve;
		});
	}
	initAudios(audios: CCAudioSource[]) {
		this.isLoaded = true;
		for (let audio of audios) {
			this.audiosMap[audio.audioName] = audio;
		}
		this.audios = audios.concat();
		if (this.notifyLoaded) {
			this.notifyLoaded();
		}
		this.onLoadingTask = undefined;
	}
	protected audiosMap: TStrMap<CCAudioSource> = EmptyTable();

	/**
	 * 所有音效
	 */
	audios: CCAudioSource[] = [];

	/**
	 * 所有背景音乐
	 */
	get musics() {
		return this.audios.filter(a => a.isBGMusic);
	}

	// protected playingAudios: CCAudioSource[] = []
	/**
	 * 获取音效
	 * @param name
	 * @returns
	 */
	getAudio(name: string): CCAudioSource | undefined {
		return this.audiosMap[name];
	}

	/**
	 * 按音频名播放指定音效
	 * @param name
	 * @param node
	 */
	playAudio(name: string, node: Node) {
		let needPlay = true;
		let play = () => {
			if (!needPlay) {
				return;
			}
			let audio = this.getAudio(name);
			if (audio) {
				if (audio.source == null) {
					audio.source = node.addComponent(AudioSourceB);
					audio.source.playOnAwake = false
					audio.setCCAudioSource(audio.source);
				}

				if (audio.isBGMusic) {
					// audio.play();
					// AudioManagerStatus.addMusic(audio)
					// if (!AudioUserConfig.isMusicEnabled) {
					// 	audio.mute()
					// }
					this.dealWithBGMPlay(audio);
					
				} else {
					if (AudioUserConfig.isEffectEnabled) {
						// 短音效类需要重新播放
						audio.stop()
						audio.play();
					}
				}
			} else {
				console.warn("audio missing: ", name)
			}
		};
		// 过期不播放
		setTimeout(() => {
			needPlay = false;
		}, 10000);
		if (this.onLoadingTask) {
			this.onLoadingTask.then(() => {
				play();
			});
		} else {
			play();
		}
	}

	protected _pauseMusic() {
		this.audios.forEach(a => a.pause());
	}

	pauseMusics() {
		if (this.onLoadingTask) {
			this.onLoadingTask.then(() => {
				this._pauseMusic()
			})
		} else {
			this._pauseMusic()
		}
	}

	protected _resumeMusic() {
		this.audios.forEach(a => a.resume());
	}

	resumeMusics() {
		if (this.onLoadingTask) {
			this.onLoadingTask.then(() => {
				this._resumeMusic()
			})
		} else {
			this._resumeMusic()
		}
	}

	/**
	 * 按序号播放指定音效
	 * @param index
	 * @param node
	 */
	playAudioByIndex(index: number, node: Node) {
		let needPlay = true;
		let play = () => {
			if (!needPlay) {
				return;
			}
			let name = Object.keys(this.audiosMap)[index];
			if (!name) {
				console.warn(`没有序号为: ${index} 的音频`);
				return;
			}
			this.playAudio(name, node)
		};
		// 过期不播放
		setTimeout(() => {
			needPlay = false;
		}, 10000);
		if (this.onLoadingTask) {
			this.onLoadingTask.then(() => {
				play();
			});
		} else {
			play();
		}
	}

	/**
	 * 获取音效数量
	 * @returns
	 */
	get count() {
		return this.audios.length;
	}

	/**
	 * 停止播放所有音效
	 */
	stopAllMusics() {
		this.audios.forEach(a => a.stop());
	}

	//处理BGM播放的2021/11/23
	dealWithBGMPlay(audio:CCAudioSource)
	{
		if(audio)
		{
			let paly = ()=>{
				audio.play();
				AudioManagerStatus.addMusic(audio)
				if (!AudioUserConfig.isMusicEnabled) {
					audio.mute()
				}
			}
			let isDelay     = audio.delayPlay!
		    let isVariSpeed = audio.fadeOrtrongerplay!

			if(isDelay &&isDelay>0)
			{
				if(isVariSpeed && isVariSpeed!=0)
				{
					if(isVariSpeed>0)
					{
						//延迟渐强的播放
						audio.source.volume = 0;
						cc.tween(audio.source).delay(isDelay).call(()=>{paly();}).to(Math.abs(isVariSpeed),{volume:1.0}).start();
						console.log("延迟渐强的播放");
					}
					else
					{
						//延迟渐弱的播放
						audio.source.volume = 1;
						cc.tween(audio.source).delay(isDelay).call(()=>{paly();}).to(Math.abs(isVariSpeed),{volume:0}).start();
						console.log("延迟渐弱的播放");
					}
				}
				else
				{
					//延迟播放
					cc.tween(audio.source).delay(isDelay).call(()=>{paly();}).start();
					console.log("延迟播放");
				}
			}
			else if(isVariSpeed && isVariSpeed!=0) 
			{
				//渐隐的效果最低只能2秒起步
				if(isVariSpeed>0)
				{

					audio.source.volume = 0;
					cc.tween(audio.source).call(()=>{paly();}).to(Math.abs(isVariSpeed),{volume:1.0}).start();
					console.log("渐强的播放");
				}
				else
				{
					audio.source.volume = 1;
					cc.tween(audio.source).call(()=>{paly();}).to(Math.abs(isVariSpeed),{volume:0}).start();
					console.log("渐弱的播放");
				}
				
			}
			else
			{
				paly();
			}

		}
	}
}
