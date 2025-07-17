import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'app-error-page-redirecting',
    templateUrl: './error-page-redirecting.component.html',
    styleUrls: ['./error-page-redirecting.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class ErrorPageRedirectingComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
