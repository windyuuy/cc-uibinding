/*
 * @Author: your name
 * @Date: 2021-08-27 13:38:40
 * @LastEditTime: 2021-09-01 09:01:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\script\ui\core\ICCDialog.ts
 */

export interface ICCDialog {

}

export interface IDialogDelegate {
	onOpened(): void
	onClosed(): void
	onShow(): void
	onHide(): void
	onExposed(): void
	onShield(): void
}
