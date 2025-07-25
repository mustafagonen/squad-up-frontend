import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { DragDropModule, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { PlayerService } from '../../services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { MgPlayerSearchComponent } from '../player-search-dialog/player-search-dialog.component';
import html2canvas from 'html2canvas';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { Firestore } from '@angular/fire/firestore';
import * as uuid from 'uuid';
import { nanoid } from 'nanoid';
import { SquadModel } from '../../models/squad.model';
import { ActivatedRoute } from '@angular/router';
import { toPng } from 'html-to-image';
import domtoimage from 'dom-to-image';
import { ToastrService } from 'ngx-toastr';
import { MgShareSquadModalComponent } from '../squad-saved-dialog/share-squad-modal.component';

@Component({
    selector: 'mg-squad-builder',
    templateUrl: './squad-builder.component.html',
    styleUrls: ['./squad-builder.component.scss'],
    imports: [
        SharedModule,
        DragDropModule,
    ],
    standalone: true
})

export class MgSquadBuilderComponent implements OnInit {

    firestore = inject(Firestore);
    fireBaseApp = initializeApp(environment.firebaseConfig);
    fireDataBase = getFirestore(this.fireBaseApp);

    @ViewChild('teamNameInput') teamNameInput!: ElementRef;
    @ViewChild('pitchBoundaryForExport') pitchBoundaryForExport!: ElementRef;

    // States Variables
    isLoading = false;
    showComponent = true;
    isSquadFromUrl = false;
    isMobileImageMode = false;
    squadFirebaseId: any;
    isShowBenchPlayers = false;
    isDragEnabled: boolean = false;
    hasDragging: boolean = false;
    isJerseyMode: boolean = false;
    isEditingTeamName: boolean = false;
    playerWidth = 70;
    playerHeight = 70;
    pitchWidth = 548; // 2px for borders
    pitchHeight = 658; // 2px for borders

    currentTeamName: any = 'Takımınız';

    formationLabels = [
        { label: "4-4-2", value: "4-4-2" },
        { label: "4-3-3", value: "4-3-3" },
        { label: "4-3-3 (2)", value: "4-3-3-(2)" },
        { label: "4-2-3-1", value: "4-2-3-1" },
        { label: "4-3-2-1", value: "4-3-2-1" },
        { label: "4-5-1", value: "4-5-1" },
        { label: "4-1-4-1", value: "4-1-4-1" },
        { label: "4-2-2-2", value: "4-2-2-2" },
        { label: "4-3-1-2", value: "4-3-1-2" },
        { label: "3-5-2", value: "3-5-2" },
        { label: "3-4-3", value: "3-4-3" },
        { label: "3-6-1", value: "3-6-1" },
        { label: "3-4-2-1", value: "3-4-2-1" },
        { label: "3-2-4-1", value: "3-2-4-1" },
        { label: "5-3-2", value: "5-3-2" },
    ];

    formations: { [key: string]: { type: string, order: number }[] } = {
        '4-4-2': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid', order: 1 }, { type: 'mid', order: 2 }, { type: 'mid', order: 3 }, { type: 'mid', order: 4 },
            { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
        ],
        '4-3-3': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
            { type: 'fw-w', order: 1 }, { type: 'fw-s', order: 1 }, { type: 'fw-w', order: 2 }
        ],
        '4-3-3-(2)': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
            { type: 'fw-w', order: 1 }, { type: 'fw-s', order: 1 }, { type: 'fw-w', order: 2 }
        ],
        '3-5-2': [
            { type: 'gk', order: 1 },
            { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
            { type: 'mid-wb', order: 1 }, { type: 'mid-wb', order: 2 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
            { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
        ],
        '4-2-3-1': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 },
            { type: 'mid-ac', order: 1 }, { type: 'mid-ac', order: 2 }, { type: 'mid-ac', order: 3 },
            { type: 'fw', order: 1 }
        ],
        '4-1-4-1': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-dm', order: 1 },
            { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
            { type: 'fw', order: 1 }
        ],
        '3-4-3': [
            { type: 'gk', order: 1 },
            { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
            { type: 'mid-wb', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-wb', order: 2 },
            { type: 'fw-w', order: 1 }, { type: 'fw-s', order: 1 }, { type: 'fw-w', order: 2 }
        ],
        '5-3-2': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 }, { type: 'def', order: 5 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
            { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
        ],
        '4-5-1': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-dm', order: 1 },
            { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
            { type: 'fw', order: 1 }
        ],
        '4-3-2-1': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-c', order: 3 },
            { type: 'mid-am', order: 1 }, { type: 'mid-am', order: 2 },
            { type: 'fw', order: 1 }
        ],
        '3-6-1': [
            { type: 'gk', order: 1 },
            { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
            { type: 'mid-dm', order: 1 }, { type: 'mid-dm', order: 2 },
            { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
            { type: 'fw', order: 1 }
        ],
        '4-2-2-2': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 },
            { type: 'mid-ac', order: 1 }, { type: 'mid-ac', order: 2 },
            { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
        ],
        '3-2-4-1': [
            { type: 'gk', order: 1 },
            { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
            { type: 'mid-dm', order: 1 }, { type: 'mid-dm', order: 2 },
            { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
            { type: 'fw', order: 1 }
        ],
        '4-4-1-1': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-w', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-w', order: 2 },
            { type: 'mid-am', order: 1 },
            { type: 'fw', order: 1 }
        ],
        '4-3-1-2': [
            { type: 'gk', order: 1 },
            { type: 'def', order: 1 }, { type: 'def', order: 2 }, { type: 'def', order: 3 }, { type: 'def', order: 4 },
            { type: 'mid-dm', order: 1 },
            { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 },
            { type: 'mid-am', order: 1 },
            { type: 'fw', order: 1 }, { type: 'fw', order: 2 }
        ],
        '3-4-2-1': [
            { type: 'gk', order: 1 },
            { type: 'def-cb', order: 1 }, { type: 'def-cb', order: 2 }, { type: 'def-cb', order: 3 },
            { type: 'mid-wb', order: 1 }, { type: 'mid-c', order: 1 }, { type: 'mid-c', order: 2 }, { type: 'mid-wb', order: 2 },
            { type: 'mid-am', order: 1 }, { type: 'mid-am', order: 2 },
            { type: 'fw', order: 1 }
        ],
    };

    players: {
        id: any,
        type: string,
        style: any,
        position: { top: any, left: any, transform: string },
        isDragging: boolean,
        playerInfo?: any,
        isHoveredToPlayerName?: any;
        alternativePlayerMode?: any;
        alternativePlayerName?: any;
        isNeedTransfer?: any;
        lastPosition?: any;
    }[] = [];

    benchPlayers: {
        id: any,
        type: string,
        style: any,
        position: { top: any, left: any, transform: string },
        isDragging: boolean,
        playerInfo?: any,
        isHoveredToPlayerName?: any;
        alternativePlayerMode?: any;
        alternativePlayerName?: any;
        isNeedTransfer?: any;
        lastPosition?: any;
    }[] = [];

    changedPlayerIdList: any = [];

    selectedFormation: string = '4-4-2';

    teamJerseyTemplates = this._playerService.teamJerseyTemplates;
    selectedTeamJerseyTemplate = this.teamJerseyTemplates[0];

    squadModel = new SquadModel();

    constructor(
        private _dialog: MatDialog,
        private _playerService: PlayerService,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.isLoading = true;
        await this.checkSquadFromUrlOrNot()
        await this.setFormation(this.selectedFormation);
        this.isLoading = false;
    }

    async checkSquadFromUrlOrNot() {
        this._activatedRoute.paramMap.subscribe(async (params) => {
            this.squadFirebaseId = params.get('id');
            if (this.squadFirebaseId) {
                const result = await this.getSquadFromUrl(this.squadFirebaseId);

                if (result && result?.length > 0) {
                    console.log(result[0]);
                    this.isSquadFromUrl = true;
                    this.currentTeamName = result[0].data['name'];
                    this.players = result[0].data['players'];
                    this.selectedFormation = result[0].data['formation'];
                    this.isJerseyMode = result[0].data['isJerseyMode'];
                    this.selectedTeamJerseyTemplate = result[0].data['teamJerseyTemplate'];
                }

                else {
                    alert('kadro bulunamadı');
                    this.isSquadFromUrl = false;
                }
            }
            else {
                this.isSquadFromUrl = false;
            }

        });
    }

    async getSquadFromUrl(squadId: any) {
        if (!squadId) { return; }
        return (
            await getDocs(query(collection(this.firestore, 'squad'), where("id", "==", squadId)))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    // Set Selected Formation
    async setFormation(formationName: string, resetAlsoPlayers?: any) {
        this.selectedFormation = formationName;
        if (resetAlsoPlayers) {
            this.showComponent = false;
            await this.calculatePlayerPositions(resetAlsoPlayers);
            this.showComponent = true;
        }
        else {
            await this.calculatePlayerPositions();
        }

    }

    // Set Players Position With Formations
    async calculatePlayerPositions(alsoResetPlayers?: any) {
        const beforeChangeFormation = this.players;
        this.players = [];
        const formationData = this.formations[this.selectedFormation];

        if (!formationData) {
            console.warn(`Diziliş bulunamadı: ${this.selectedFormation}`);
            return;
        }

        const positionMap: { [type: string]: { top: number, left: number }[] } = {};

        positionMap['gk'] = [{ top: 90, left: 50 }];
        positionMap['def'] = [
            { top: 73, left: 11 }, { top: 75, left: 37 }, { top: 75, left: 63 }, { top: 73, left: 89 }
        ];
        positionMap['def-cb'] = [
            { top: 75, left: 25 }, { top: 75, left: 50 }, { top: 75, left: 75 }
        ];
        positionMap['def-wb'] = [
            { top: 60, left: 8 }, { top: 60, left: 92 }
        ];
        positionMap['mid-c'] = [
            { top: 50, left: 25 }, { top: 50, left: 50 }, { top: 50, left: 75 }
        ];
        positionMap['mid-w'] = [
            { top: 45, left: 11 }, { top: 45, left: 89 }
        ];
        positionMap['mid-dm'] = [
            { top: 55, left: 50 }, { top: 55, left: 37 }, { top: 55, left: 63 }
        ];
        positionMap['mid-am'] = [
            { top: 25, left: 50 }, { top: 25, left: 37 }, { top: 25, left: 63 },
            { top: 30, left: 20 }, { top: 25, left: 50 }, { top: 30, left: 80 }
        ];
        positionMap['mid-am-w'] = [
            { top: 35, left: 30 }, { top: 35, left: 70 }
        ];
        positionMap['fw'] = [
            { top: 13, left: 50 }, { top: 13, left: 37 }, { top: 13, left: 63 }
        ];
        positionMap['fw-w'] = [
            { top: 20, left: 20 }, { top: 20, left: 80 }
        ];
        positionMap['fw-s'] = [
            { top: 13, left: 50 }
        ];

        // Detailed Formations Config
        if (this.selectedFormation === '4-4-2') {
            positionMap['mid'] = [
                { top: 45, left: 11 }, { top: 50, left: 37 }, { top: 50, left: 63 }, { top: 45, left: 89 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormation === '4-3-3') {
            positionMap['mid-c'] = [
                { top: 45, left: 25 }, { top: 50, left: 50 }, { top: 45, left: 75 }
            ];
        } else if (this.selectedFormation === '4-3-3-(2)') {
            positionMap['mid-c'] = [
                { top: 50, left: 25 }, { top: 45, left: 50 }, { top: 50, left: 75 }
            ];
        } else if (this.selectedFormation === '3-5-2') {
            positionMap['mid-wb'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 30 }, { top: 55, left: 50 }, { top: 45, left: 70 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormation === '4-2-3-1') {
            positionMap['mid-c'] = [
                { top: 55, left: 37 }, { top: 55, left: 63 }
            ];
            positionMap['mid-ac'] = [
                { top: 37, left: 25 }, { top: 32, left: 50 }, { top: 37, left: 75 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '4-1-4-1') {
            positionMap['mid-dm'] = [
                { top: 55, left: 50 }
            ];
            positionMap['mid-w'] = [
                { top: 35, left: 11 }, { top: 35, left: 89 }
            ];
            positionMap['mid-c'] = [
                { top: 40, left: 37 }, { top: 40, left: 63 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '3-4-3') {
            positionMap['mid-wb'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 50, left: 37 }, { top: 50, left: 63 }
            ];
        } else if (this.selectedFormation === '5-3-2') {
            positionMap['def'] = [
                { top: 73, left: 8 }, { top: 75, left: 28 }, { top: 75, left: 50 }, { top: 75, left: 72 }, { top: 73, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 25 }, { top: 50, left: 50 }, { top: 45, left: 75 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormation === '4-5-1') {
            positionMap['mid-dm'] = [
                { top: 55, left: 50 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 30 }, { top: 45, left: 70 }
            ];
            positionMap['mid-w'] = [
                { top: 35, left: 11 }, { top: 35, left: 89 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '4-3-2-1') {
            positionMap['mid-c'] = [
                { top: 50, left: 25 }, { top: 55, left: 50 }, { top: 50, left: 75 }
            ];
            positionMap['mid-am'] = [
                { top: 30, left: 37 }, { top: 30, left: 63 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '3-6-1') {
            positionMap['mid-dm'] = [
                { top: 55, left: 37 }, { top: 55, left: 63 }
            ];
            positionMap['mid-c'] = [
                { top: 35, left: 37 }, { top: 35, left: 63 }
            ];
            positionMap['mid-w'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '4-2-2-2') {
            positionMap['mid-c'] = [
                { top: 55, left: 42 }, { top: 55, left: 58 }
            ];
            positionMap['mid-ac'] = [
                { top: 40, left: 22 }, { top: 40, left: 78 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormation === '3-2-4-1') {
            positionMap['mid-dm'] = [
                { top: 55, left: 37 }, { top: 55, left: 63 }
            ];
            positionMap['mid-w'] = [
                { top: 30, left: 10 }, { top: 30, left: 90 }
            ];
            positionMap['mid-c'] = [
                { top: 35, left: 40 }, { top: 35, left: 60 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '4-4-1-1') {
            positionMap['mid-w'] = [
                { top: 50, left: 11 }, { top: 50, left: 89 }
            ];
            positionMap['mid-c'] = [
                { top: 50, left: 37 }, { top: 50, left: 63 }
            ];
            positionMap['mid-am'] = [
                { top: 30, left: 50 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormation === '4-3-1-2') {
            positionMap['mid-dm'] = [
                { top: 55, left: 50 }
            ];
            positionMap['mid-c'] = [
                { top: 50, left: 30 }, { top: 50, left: 70 }
            ];
            positionMap['mid-am'] = [
                { top: 30, left: 50 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 37 }, { top: 13, left: 63 }
            ];
        } else if (this.selectedFormation === '3-4-2-1') {
            positionMap['mid-wb'] = [
                { top: 45, left: 10 }, { top: 45, left: 90 }
            ];
            positionMap['mid-c'] = [
                { top: 50, left: 37 }, { top: 50, left: 63 }
            ];
            positionMap['mid-am'] = [
                { top: 30, left: 37 }, { top: 30, left: 63 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        }

        let playerId = 0;
        formationData.forEach(playerDef => {
            const positionsOfType = positionMap[playerDef.type];
            if (positionsOfType && playerDef.order <= positionsOfType.length) {
                const pos = positionsOfType[playerDef.order - 1];
                this.players.push({
                    id: playerId++,
                    type: playerDef.type,
                    position: { top: pos.top, left: pos.left, transform: `translate(-50%, -50%)` },
                    style: {
                        top: `${pos.top}%`,
                        left: `${pos.left}%`,
                        transform: `translate(-50%, -50%)`
                    },
                    isDragging: false
                });
                if (playerId < 7) {
                    this.benchPlayers.push({
                        id: playerId,
                        type: playerDef.type,
                        position: { top: pos.top, left: pos.left, transform: `translate(-50%, -50%)` },
                        style: {
                            top: `${pos.top}%`,
                            left: `${pos.left}%`,
                            transform: `translate(-50%, -50%)`
                        },
                        isDragging: false
                    });
                }
            } else {
                console.warn(`Pozisyon verisi eksik veya fazla: Tip - ${playerDef.type}, Sıra - ${playerDef.order} for formation ${this.selectedFormation}`);
            }


        });

        if (!alsoResetPlayers) {
            beforeChangeFormation.forEach(player => {
                if (player.playerInfo) {
                    this.players[player.id].playerInfo = player.playerInfo;
                    this.players[player.id].isNeedTransfer = player.isNeedTransfer;
                }
            });
        }
    }

    // To Reset Transform Style Coming With CDK Drag
    async onResetPlayersTransform() {
        this.showComponent = false;  // component yok olur
        setTimeout(() => {
            this.showComponent = true; // component yeniden oluşturulur
            this.calculatePlayerPositions();
        });
    }

    // To Reset Player Names
    async onResetPlayersName() {
        this.players = [];
    }

    // To set or change Selected Team Jersey
    setTeamJerseyTemplate(teamJerseyTemplate: any) {
        this.selectedTeamJerseyTemplate = teamJerseyTemplate;
    }

    // Search Player API
    async onPlayerSearchClick(player: any, type: any) {
        if (this.hasDragging) return; // Avoid click and dragging at the same time
        const dialog = this._dialog.open(MgPlayerSearchComponent, {
            disableClose: false,
            width: '500px',
            maxWidth: '90vw',
            height: '500px',
            maxHeight: '80vh',
            panelClass: 'dark-dialog-panel'
        });
        dialog.componentInstance.previousSearchPlayer = player.playerInfo;

        dialog.afterClosed().subscribe((selectedPlayer) => {
            if (selectedPlayer) {
                if (type == 'player') {
                    this.players[player.id].playerInfo = selectedPlayer;
                    if (selectedPlayer.shortName !== 'Transfer') {
                        this.players[player.id].isNeedTransfer = false;
                    }
                    else {
                        this.players[player.id].isNeedTransfer = true;
                    }
                }

                else if (type == 'benchPlayer') {
                    this.benchPlayers[player.id - 1].playerInfo = selectedPlayer;
                    if (selectedPlayer.shortName !== 'Transfer') {
                        this.benchPlayers[player.id - 1].isNeedTransfer = false;
                    }
                    else {
                        this.benchPlayers[player.id - 1].isNeedTransfer = true;
                    }
                }

            }
        });
    }

    // Start Editing Title
    startEditingTeamName() {
        this.isEditingTeamName = true;
        // Input alanı DOM'a eklendikten sonra odaklanmak için küçük bir gecikme
        setTimeout(() => {
            this.teamNameInput.nativeElement.focus();
        }, 0);
    }

    // Stop Editing Title
    stopEditingTeamName() {
        this.isEditingTeamName = false;
        // Eğer kullanıcı boş bir isim bıraktıysa varsayılanı geri yükle
        if (this.currentTeamName.trim() === '') {
            this.currentTeamName = 'Takımınız';
        }
    }

    // Export As Image
    async exportAsPng(fromSaveSquad?: any) {
        // if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        //     this.isMobileImageMode = true;
        // }
        console.log('gelsm');

        this.isMobileImageMode = true;
        const element = this.pitchBoundaryForExport.nativeElement;
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${day}/${month}/${year} - ${hours}:${minutes}`;
        toPng(element, { cacheBust: true })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${this.currentTeamName} - ${formattedDateTime}`;
                setTimeout(() => {
                    link.click();
                }, 2000);

                if (!fromSaveSquad) {
                    const img = document.createElement('img');
                    img.src = dataUrl;
                    img.style.maxWidth = '100%';
                    img.style.marginTop = '16px';
                    const hedefDiv = document.getElementById('iphone-image-area');
                    console.log(hedefDiv);

                    if (hedefDiv) {
                        hedefDiv.innerHTML = '';
                        hedefDiv.appendChild(img);
                    }
                }

            });
    }

    // Export As Image Alternative package library
    async exportCaptureAsImageClick() {
        this.isLoading = true;
        await this.convertImagesToBase64();
        const element = this.pitchBoundaryForExport.nativeElement;
        try {
            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                scale: 2, // yüksek çözünürlük
                backgroundColor: '#0d1222',
            });
            const imageData = canvas.toDataURL('image/png'); // 'image/jpeg' de kullanabilirsiniz
            // Resmi indirmek için bir link oluştur
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'div-content.png'; // İndirilen dosyanın adı
            document.body.appendChild(link); // Linki DOM'a ekle (görünmez olabilir)
            link.click(); // Linke tıkla
            document.body.removeChild(link); // Linki DOM'dan kaldır

        } catch (error) {
            console.error('Dışa aktarılırken bir hata oluştu:', error);
            this.isLoading = false;
        }
        this.isLoading = false;
    }

    // Save My Squad
    async onSaveSquadClick() {
        try {
            const hasMissingPlayerInfo = this.players.some(item => !item.hasOwnProperty('playerInfo'));
            if (hasMissingPlayerInfo) {
                this._toastrService.warning(' Takım kadrosu eksik görünüyor. Lütfen eksik oyuncuları tamamlayın.');
                return;
            }

            if (this.currentTeamName == 'Takımınız') {
                this.startEditingTeamName();
                return;
            }

            const nanoId = nanoid(10);
            const dbId = this.isSquadFromUrl ? this.squadFirebaseId : nanoId
            const squadData = {
                id: dbId,
                name: this.currentTeamName,
                formation: this.selectedFormation,
                isJerseyMode: this.isJerseyMode,
                teamJerseyTemplate: this.selectedTeamJerseyTemplate,
                createdAt: serverTimestamp(),
                players: this.players,
            }
            await setDoc(doc(this.fireDataBase, "squad", dbId), squadData);
            this._toastrService.success('Kadronuz başarıyla kaydedildi.');

            const dialog = this._dialog.open(MgShareSquadModalComponent, {
                disableClose: false,
                maxWidth: '90vw',
                maxHeight: '80vh',
                panelClass: 'dark-dialog-panel'
            });
            dialog.componentInstance.generatedShareLink = environment.appUrl + 'squad-builder/' + dbId;

        } catch (error) {
            console.error(error);
        }
    }

    // Continue New Team Without Saved Squad
    async onCreateNewTeam() {
        window.location.href = '/squad-builder'
    }

    // Activate Alternative Player
    activateAlternativePlayerTextarea(player: any) {
        if (!player.playerInfo) { return; }
        this.players[player.id].alternativePlayerMode = true;
        const textareaElement = document.getElementById('textarea' + player.id) as HTMLTextAreaElement;
        if (textareaElement) {
            textareaElement.focus();
        }
    }

    // Handle Add to Alternative Player on Textarea
    async handeEnterAlternativePlayerTextarea(event: Event, player: any) {
        event.preventDefault();
        this.players[player.id].alternativePlayerMode = false;
        const textareaElement = document.getElementById('textarea' + player.id) as HTMLTextAreaElement;
        if (textareaElement) {
            textareaElement.blur();
        }
    }

    // Toggle Bench Players
    toggleBenchPlayers() {
        this.isShowBenchPlayers = !this.isShowBenchPlayers;
    }

    async convertImagesToBase64() {
        // const images = document.querySelectorAll('img');

        // for (const img of Array.from(images)) {
        //     const url = img.src;

        //     // Base64'e çevir
        //     const response = await fetch(url);
        //     const blob = await response.blob();

        //     const base64 = await new Promise<string>((resolve) => {
        //         const reader = new FileReader();
        //         reader.onloadend = () => resolve(reader.result as string);
        //         reader.readAsDataURL(blob);
        //     });

        //     img.src = base64; // Artık CORS problemi yok
        // }
    }

    undoPlayerPosition() {
        this.players[this.changedPlayerIdList[this.changedPlayerIdList.length - 1]].position = {
            top: `${this.players[this.changedPlayerIdList[this.changedPlayerIdList.length - 1]].lastPosition.top}%`,
            left: `${this.players[this.changedPlayerIdList[this.changedPlayerIdList.length - 1]].lastPosition.left}%`,
            transform: `translate(-50%, -50%)`
        };
        this.players[this.changedPlayerIdList[this.changedPlayerIdList.length - 1]].style = {
            top: `${this.players[this.changedPlayerIdList[this.changedPlayerIdList.length - 1]].lastPosition.top}%`,
            left: `${this.players[this.changedPlayerIdList[this.changedPlayerIdList.length - 1]].lastPosition.left}%`,
            transform: `translate(-50%, -50%)`
        };
    }

    onPlayerDragStarted(player: any) {
        player.isDragging = true;
        this.hasDragging = true;
        player.lastPosition = { top: player.position.top, left: player.position.left };
    }

    onPlayerDragMoved(event: any, player: any) {
        const el = event.source.getRootElement();

        const left = parseFloat(el.style.left || '0');
        const top = parseFloat(el.style.top || '0');

        // player.position = {
        //     top,
        //     left,
        //     transform: '' // kaldırıldı
        // };
    }

    onPlayerDragEnded(player: any, event: CdkDragEnd) {

        const pitch = document.getElementById('pitchBoundary');
        const playerElement = document.getElementById(player.id);

        if (pitch && playerElement) {
            const pitchRect = pitch.getBoundingClientRect();
            const playerRect = playerElement.getBoundingClientRect();

            const offsetLeft = playerRect.left - pitchRect.left - 2;
            const offsetTop = playerRect.top - pitchRect.top - 2;
            const roundedLeft = parseFloat(offsetLeft.toFixed(3)) + (this.playerWidth / 2);
            const roundedTop = parseFloat(offsetTop.toFixed(3)) + (this.playerHeight / 2);
            const leftPercentage = Math.round((roundedLeft / this.pitchWidth) * 100);
            const topPercentage = Math.round((roundedTop / this.pitchHeight) * 100);

            this.players[player.id].position = {
                top: `${topPercentage}%`,
                left: `${leftPercentage}%`,
                transform: `translate(-50%, -50%)`
            };



            setTimeout(() => {
                player.isDragging = false;
                this.hasDragging = false;
                this.changedPlayerIdList.push(player.id);
            });
        }

        return;
        const el = event.source.element.nativeElement as HTMLElement;
        const style = window.getComputedStyle(el);
        const transform = style.transform || style.webkitTransform || '';

        // transform örn: matrix(1, 0, 0, 1, 30, -15)
        // Veya translate3d(30px, -15px, 0px) olabilir
        // matrix ile çalışmak daha genel, çünkü bazı browserlar matrix kullanır

        let x = 0;
        let y = 0;

        // if (transform.startsWith('matrix3d(')) {
        //     // matrix3d(a1, a2, ..., tx, ty, tz, ...)
        //     // tx = 13. değer, ty = 14. değer (indeks 12, 13)
        //     const values = transform
        //         .replace('matrix3d(', '')
        //         .replace(')', '')
        //         .split(',')
        //         .map(v => parseFloat(v));
        //     x = values[12];
        //     y = values[13];
        // } else if (transform.startsWith('matrix(')) {
        //     // matrix(a, b, c, d, tx, ty)
        //     const values = transform
        //         .replace('matrix(', '')
        //         .replace(')', '')
        //         .split(',')
        //         .map(v => parseFloat(v));
        //     x = values[4];
        //     y = values[5];
        // } else {
        //     // Eğer kesin translate3d var ise regex ile ayıkla
        //     const regex = /translate3d\((-?\d+)px,\s*(-?\d+)px,\s*(-?\d+)px\)/;
        //     const match = transform.match(regex);
        //     if (match) {
        //         x = parseInt(match[1], 10);
        //         y = parseInt(match[2], 10);
        //     }
        // }

        // const width = 514; // 2px for borders
        // const height = 618; // 2px for borders

        // const xPercent = (x / width) * 100;
        // const yPercent = (y / height) * 100;

        // const newLeft = parseFloat(player.style.left.replace('%', '')) + parseFloat(xPercent.toFixed(2));

        // const newTop = parseFloat(player.style.top.replace('%', '')) + yPercent.toFixed(2);
        // player.style = {
        //     left: `${newLeft}%`,
        //     top: `${newTop}%`,
        //     transform: `translate(-50%, -50%)`,
        // };
        // return;
        // const draggedElement = event.source.element.nativeElement;
        // const parent = draggedElement.parentElement;

        // const elRect = draggedElement.getBoundingClientRect();
        // const parentRect = parent!.getBoundingClientRect();
        // const pitchWidth = 514;
        // const pitchHeight = 618;
        // const absoluteX = elRect.left - parentRect.left;
        // const absoluteY = elRect.top - parentRect.top;
        // const percentLeft = (absoluteX / pitchWidth) * 100;
        // const percentTop = (absoluteY / pitchHeight) * 100;
        // player.position.top = percentTop;
        // // player.style = {
        // //     left: `${percentLeft}%`,
        // //     top: `${percentTop}%`,
        // //     transform: `translate(-50%, -50%)`,
        // // };
        // player.isDragging = false;


        // player.isDragging = false;

        // // if (this.checkCollision(player)) {
        // //     // Geri dönüş için yeni obje ata ki Angular algılasın
        // //     if (player.lastPosition) {
        // //         player.position = {
        // //             top: player.lastPosition.top,
        // //             left: player.lastPosition.left,
        // //             transform: '' // artık kullanmıyoruz
        // //         };
        // //     }
        // // }

    }

    checkCollision(current: any): boolean {
        // const playerSize = 70; // px cinsinden
        const pitchWidth = 514;
        const pitchHeight = 618;

        const currentLeft = (current.position.left / 100) * pitchWidth;
        const currentTop = (current.position.top / 100) * pitchHeight;
        // const currentRight = currentLeft + playerSize;
        // const currentBottom = currentTop + playerSize;

        return this.players.some(other => {
            if (other.id === current.id) return false;


            const otherLeft = (other.position.left / 100) * pitchWidth;
            const otherTop = (other.position.top / 100) * pitchHeight;
            const isOverlapping = false;
            return false;

            if (Math.abs(currentLeft - otherLeft))

                // const otherRight = otherLeft + playerSize;
                // const otherBottom = otherTop + playerSize;

                // const isOverlapping = !(
                //     currentRight < otherLeft ||
                //     currentLeft > otherRight ||
                //     currentBottom < otherTop ||
                //     currentTop > otherBottom
                // );

                // if (isOverlapping) {
                //     );
                // }

                return false;
        });

    }



}