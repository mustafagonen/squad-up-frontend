import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared.module';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class ErrorPageComponent implements OnInit {

    constructor(
        private _router: Router,
    ) { }

    ngOnInit(): void { }

    onNavigateHomePage() {
        this._router.navigateByUrl(`/`);
    }

}
