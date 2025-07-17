import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})
export class ConfirmationComponent {
    @Input() model!: { title?: string, content?: string, width?: string, subcontent?: string, subcontentHtml?: string, item?: string, imageUrl?: string, okBtnText?: string, dismissBtnText?: string, status?: string, primaryBtnClass?: string, secondaryBtnClass?: string, hasTextArea?: boolean, closeEmitValue?: any };
    @Output() confirm = new EventEmitter<boolean>();
    @Output() textAreaValueOutput = new EventEmitter<any>();
    textAreaValue: any;
    ngOnInit(): void {
        const wrapper = document.getElementsByClassName('mat-mdc-dialog-surface');
        if (wrapper) {
            wrapper[0].classList.add('danger');
        }
    }

    onSubmitClick() {
        if (this.textAreaValue) {
            this.textAreaValueOutput.emit(this.textAreaValue);
        }
        else {
            this.confirm.emit(true);
        }
    }
}
