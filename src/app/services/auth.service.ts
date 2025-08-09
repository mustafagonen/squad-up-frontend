import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Observable, from, switchMap } from 'rxjs';
import { FirebaseService } from './firebase.service';

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Date | any;
    roles: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user$: Observable<User | any>;

    constructor(
        private _auth: Auth,
        private _firebaseService: FirebaseService,
    ) {
        this.user$ = user(this._auth).pipe(
            switchMap(async firebaseUser => {
                if (firebaseUser) {
                    const userDocRef = doc(this._firebaseService.firestore, "users", firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        return {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                            ...userDoc.data()
                        } as AppUser;
                    } else {
                        console.warn(`Firestore'da ${firebaseUser.uid} için belge bulunamadı.`);
                        return {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                            createdAt: new Date(),
                            roles: ['user']
                        } as AppUser;
                    }
                } else {
                    return null;
                }
            })
        );
    }

    async googleSignIn(): Promise<void> {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this._auth, provider);
            const user = result.user;

            // Kullanıcının Firestore'a kaydedilmesi veya güncellenmesi
            await this.saveUserToFirestore(user);

        } catch (error) {
            console.error("Google signIn hatası (AuthService):", error);
            throw error; // Hatayı çağıran fonksiyona ilet
        }
    }

    private async saveUserToFirestore(user: any): Promise<void> {
        console.log(user, '1');

        const userRef = doc(this._firebaseService.firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const firebaseUserData = userSnap.data();

        if (userSnap.exists()) {
            console.log("Firestore verileri:", userSnap.data());
        } else {
            console.log("Firestore'da kullanıcı bulunamadı");
        }
        console.log(user, '2');

        const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
            roles: firebaseUserData?.['roles']
        };
        console.log(userData, 'asıl');


        try {
            // merge: true ile mevcut belgeleri bozmadan yeni alanları ekle/güncelle
            await setDoc(userRef, userData, { merge: true });
            console.log("Kullanıcı bilgileri Firestore'a kaydedildi/güncellendi:", user.uid);
        } catch (error) {
            console.error("Firestore'a kullanıcı kaydedilirken hata:", error);
            throw error; // Hatayı yukarıya ilet
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(this._auth);
        } catch (error) {
            console.error("Oturum kapatma hatası:", error);
            // Hata yönetimi
        }
    }

    getCurrentUser(): User | null {
        return this._auth.currentUser;
    }
}