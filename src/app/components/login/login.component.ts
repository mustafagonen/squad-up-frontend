import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // AuthService'i doğru yoldan import edin
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'mg-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})
export class MgLoginComponent {
    isLoading: boolean = false;
    errorMessage: string | null = null;
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    async signInWithGoogle(): Promise<void> {
        this.isLoading = true;
        this.errorMessage = null;

        try {
            await this.authService.googleSignIn();
            this.authService.user$.subscribe(user => {
                if (user) {
                    console.log(user);
                    this.router.navigate(['/taktik-tahtasi']);
                }
                this.isLoading = false;
            });

        } catch (error: any) {
            this.isLoading = false;
            console.error("Google oturum açma hatası:", error);
            if (error.code === 'auth/popup-closed-by-user') {
                this.errorMessage = 'Giriş işlemi iptal edildi.';
            } else if (error.code === 'auth/cancelled-popup-request') {
                this.errorMessage = 'Zaten açık bir giriş penceresi var. Lütfen ona bakın.';
            }
            else {
                this.errorMessage = 'Giriş yaparken bir sorun oluştu. Lütfen tekrar deneyin.';
            }
        }
    }
}