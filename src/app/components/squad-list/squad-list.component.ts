import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { collection, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

interface PlayerPosition {
    id: number;
    type: string;
    position: {
        top: number;
        left: number;
        transform?: string;
    };
}

interface SquadData {
    id: string;
    name: string;
    formation: string;
    players: PlayerPosition[];
    saveDate: Date;
}

@Component({
    selector: 'mg-squad-list',
    templateUrl: './squad-list.component.html',
    styleUrls: ['./squad-list.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})
export class MgSquadListComponent implements OnInit {

    firestore = inject(Firestore);
    fireBaseApp = initializeApp(environment.firebaseConfig);
    fireDataBase = getFirestore(this.fireBaseApp);

    savedSquads: any;
    isLoading = false;
    showComponent = true;

    constructor(
        // private squadService: SquadService, // Servisi dışarıdan almak yerine, dummy veri kullanacağız
        private router: Router
    ) { }

    async ngOnInit() {
        this.isLoading = true;
        this.savedSquads = await this.getSquadList();
        this.isLoading = false;
    }

    viewSquadDetails(squadId: string): void {
        this.router.navigate(['/squad-builder', squadId]);
    }

    async getSquadList() {
        return (
            await getDocs(query(collection(this.firestore, 'squad')))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }
}