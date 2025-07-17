import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    constructor(private _dialog: MatDialog) { }

    public confirm(model?: { title?: string, content?: string, width?: string, disableClose?: boolean, subcontent?: string, subcontentHtml?: string, item?: string, imageUrl?: string, okBtnText?: string, dismissBtnText?: string, status?: string, primaryBtnClass?: string, secondaryBtnClass?: string, hasTextArea?: boolean, closeEmitValue?: any }): Promise<boolean> {
        return new Promise<any>((resolve, reject) => {
            const ref = this._dialog.open(ConfirmationComponent, { disableClose: model?.disableClose ? model.disableClose : true, width: model?.width });
            ref.componentInstance.model = model!;

            const sub = ref.componentInstance.confirm.subscribe((decision: boolean) => {
                sub.unsubscribe();
                ref.close();
                resolve(decision);
            });

            const sub2 = ref.componentInstance.textAreaValueOutput.subscribe((decision: any) => {
                sub2.unsubscribe();
                ref.close();
                resolve(decision);
            });
        });
    }
}