

import * as cc from "cc"
import { IVector, Vector2, Vector3, Vector4 } from "./Vector"

interface IVecTool {
	toCCVec(vec: Vector2): cc.Vec2
	toCCVec(vec: Vector3): cc.Vec3
	toCCVec(vec: Vector4): cc.Vec4
}
class VecTool implements IVecTool {
	toCCVec(vec: IVector): any {
		if (vec instanceof Vector2) {
			return new cc.Vec2(vec.x, vec.y)
		} else if (vec instanceof Vector3) {
			return new cc.Vec3(vec.x, vec.y, vec.z)
		} else if (vec instanceof Vector4) {
			return new cc.Vec4(vec.x, vec.y, vec.z, vec.w)
		}
		throw new Error("invalid vec to conv")
	}
}

export const toCCVec = ((new VecTool) as IVecTool).toCCVec
