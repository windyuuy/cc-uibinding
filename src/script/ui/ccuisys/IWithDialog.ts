/*
 * @Author: your name
 * @Date: 2021-08-25 10:20:22
 * @LastEditTime: 2021-08-25 12:14:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\script\ui\core\IWithDialog.ts
 */

import { CCDialog } from "./CCDialogComp";

export interface IWithDialog {
	initWithDialog(dialog: CCDialog): void
}


