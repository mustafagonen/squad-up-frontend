import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

    selectedMenu = 'kadro-kur';

    @ViewChild('mobileMenu') mobileMenu!: ElementRef;
    isMenuOpen: boolean = false;

    constructor(
        private _router: Router,
        public authService: AuthService
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

    async logout(): Promise<void> {
        try {
            await this.authService.signOut();
            this._router.navigate(['/kadro-kur']);
        } catch (error) {
            console.error("Oturum kapatma hatası:", error);
            alert("Oturum kapatılırken bir sorun oluştu.");
        }
    }
}
