import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user$: Observable<User | null>;

    constructor(private auth: Auth) {
        this.user$ = new Observable<User | null>(observer => {
            this.auth.onAuthStateChanged(user => {
                observer.next(user);
            });
        });
    }

    async googleSignIn(): Promise<void> {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(this.auth, provider);
        } catch (error) {
            console.error("Google oturum açma hatası:", error);
            // Hata yönetimi (kullanıcıya bildirim vb.)
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error("Oturum kapatma hatası:", error);
            // Hata yönetimi
        }
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }
}