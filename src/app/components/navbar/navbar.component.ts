import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'mg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})
export class MgNavbarComponent implements OnInit {

    selectedMenu = 'squad-builder';

    @ViewChild('mobileMenu') mobileMenu!: ElementRef;
    isMenuOpen: boolean = false;

    constructor(
        private _router: Router,
    ) {
        this._router.events.subscribe(async (e) => {
            if (e instanceof NavigationEnd) {
                this.selectedMenu = e.url;
            }
        });
    }

    ngOnInit(): void { }

    toggleMenuWrapper() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
