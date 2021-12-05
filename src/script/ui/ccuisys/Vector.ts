import { EDITOR } from "cc/env"

export let Vector!: typeof fsync.Vector

export let Vector2!: typeof fsync.Vector2

export let Vector3!: typeof fsync.Vector3

export let Vector4!: typeof fsync.Vector4
export let Quat!: typeof fsync.Quat

export let Size2!: typeof fsync.Size2

export let Size3!: typeof fsync.Size3

export let Rect!: typeof fsync.Rect

export type Vector = fsync.Vector

export type Vector2 = fsync.Vector2

export type Vector3 = fsync.Vector3

export type Vector4 = fsync.Vector4
export type Quat = fsync.Quat

export type Size2 = fsync.Size2

export type Size3 = fsync.Size3

export type Rect = fsync.Rect

export type IVector = fsync.IVector

if (!EDITOR) {
	Vector = fsync.Vector
	Vector2 = fsync.Vector2
	Vector3 = fsync.Vector3
	Vector4 = fsync.Vector4
	Quat = fsync.Quat
	Size2 = fsync.Size2
	Size3 = fsync.Size3
	Rect = fsync.Rect
}
