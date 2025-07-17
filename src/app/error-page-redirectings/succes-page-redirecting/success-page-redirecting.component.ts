import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'app-success-page-redirecting',
    templateUrl: './success-page-redirecting.component.html',
    styleUrls: ['./success-page-redirecting.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class SuccessPageRedirectingComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
