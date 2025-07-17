import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
    selector: 'mg-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class MgPaginationComponent implements OnInit {
    @ViewChild('pageInput') pageInput!: ElementRef;

    @Input() public data: any;
    @Output() onNextPage = new EventEmitter();
    @Output() onPreviousPage = new EventEmitter();
    @Output() onSpecificPage = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    onPageChangeByInput(activePage: any) {

        if (activePage > this.data.pages) {
            this.pageInput.nativeElement.value = this.data.pages;
        }
        this.onSpecificPage.emit(activePage ? activePage - 1 : 0);
    }

    onlyNumber(event: KeyboardEvent): void {
        const charCode = event.key.charCodeAt(0);
        // Sadece 0-9 arasındaki karakterleri kabul et
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }
}
