import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    public firebaseApp: FirebaseApp;
    public firestore: Firestore;

    constructor() {
        this.firebaseApp = initializeApp(environment.firebaseConfig);
        this.firestore = getFirestore(this.firebaseApp);
    }
}
