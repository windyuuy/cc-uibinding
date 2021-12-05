import { cname } from "../basic";

/**
 * 音效设置
 */
@cname("TAudioUserConfig")
export class TAudioUserConfig {
	isEffectEnabled: boolean = true;
	effectVolume: number = 1
	isMusicEnabled: boolean = true;
	musicVolume: number = 1
}

export const AudioUserConfig = new TAudioUserConfig();
