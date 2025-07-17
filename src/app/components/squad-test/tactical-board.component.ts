import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { DragDropModule, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { PlayerService } from '../../services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { MgPlayerSearchComponent } from '../player-search-dialog/player-search-dialog.component';
import html2canvas from 'html2canvas';

@Component({
    selector: 'mg-tactical-board',
    templateUrl: './tactical-board.component.html',
    styleUrls: ['./tactical-board.component.scss'],
    imports: [
        SharedModule,
        DragDropModule,
    ],
    standalone: true
})

export class MgTacticalBoardComponent implements OnInit {

    @ViewChild('teamNameInput') teamNameInput!: ElementRef;
    @ViewChild('pitchBoundaryForExport') pitchBoundaryForExport!: ElementRef;

    // States Variables
    showComponent = true;
    isDragEnabled: boolean = false;
    hasDragging: boolean = false;
    isJerseyMode: boolean = false;
    isEditingTeamName: boolean = false;
    playerWidth = 70;
    playerHeight = 70;
    pitchWidth = 514; // 2px for borders
    pitchHeight = 618; // 2px for borders

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
        id: number,
        type: string,
        style: any,
        position: { top: any, left: any, transform: string },
        isDragging: boolean,
        playerInfo?: any,
        lastPosition?: any
    }[] = [];

    changedPlayerIdList: any = [];

    selectedFormationName: string = '4-4-2'; // Default Formation

    teamJerseyTemplates = [
        {
            label: 'Fenerbahçe',
            shortName: 'FB',
            primaryColor: '#002749',
            secondaryColor: '#ffed00',
            border: '2px solid #ffed00',
            sleeveBorder: '1px solid #002749'
        },
        {
            label: 'Galatasaray',
            shortName: 'GS',
            primaryColor: '#a90432',
            secondaryColor: '#fdb912',
            border: '2px solid #fdb912',
            sleeveBorder: '1px solid #a90432'
        },
        {
            label: 'Beşiktaş',
            shortName: 'BJK',
            primaryColor: '#000',
            secondaryColor: '#fff',
            border: '2px solid #fff',
            sleeveBorder: '1px solid #000'
        },
        {
            label: 'Trabzonspor',
            shortName: 'TS',
            primaryColor: '#a41d34',
            secondaryColor: '#14c0f1',
            border: '2px solid #14c0f1',
            sleeveBorder: '1px solid #a41d34'
        },
        {
            label: 'Başakşehir',
            shortName: 'İBFK',
            primaryColor: '#163A52',
            secondaryColor: '#FF5704',
            border: '2px solid #FF5704',
            sleeveBorder: '1px solid #163A52'
        },
        {
            label: 'Kocaelispor',
            shortName: 'KOC',
            primaryColor: '#000000',
            secondaryColor: '#006600',
            border: '2px solid #006600',
            sleeveBorder: '1px solid #000000'
        },
        {
            label: 'Gençlerbirliği',
            shortName: 'GB',
            primaryColor: '#000000',
            secondaryColor: '#e91b23',
            border: '2px solid #e91b23',
            sleeveBorder: '1px solid #000000'
        },
        {
            label: 'Konyaspor',
            shortName: 'KNY',
            primaryColor: '#00804d',
            secondaryColor: '#fff',
            border: '2px solid #fff',
            sleeveBorder: '1px solid #00804d'
        },
    ];

    selectedTeamJerseyTemplate = this.teamJerseyTemplates[0];

    constructor(
        private _dialog: MatDialog,
        private _playerService: PlayerService
    ) { }

    ngOnInit() {
        this.setFormation(this.selectedFormationName);
        this.onPlayerTest();
    }

    // Set Selected Formation
    setFormation(formationName: string) {
        this.selectedFormationName = formationName;
        this.calculatePlayerPositions();
        this.onResetPlayersTransform();
    }

    // Set Players Position With Formations
    calculatePlayerPositions() {
        const beforeChangeFormation = this.players;
        this.players = [];
        const formationData = this.formations[this.selectedFormationName];

        if (!formationData) {
            console.warn(`Diziliş bulunamadı: ${this.selectedFormationName}`);
            return;
        }

        const positionMap: { [type: string]: { top: number, left: number }[] } = {};

        positionMap['gk'] = [{ top: 92, left: 50 }];
        positionMap['def'] = [
            { top: 73, left: 11 }, { top: 77, left: 37 }, { top: 77, left: 63 }, { top: 73, left: 89 }
        ];
        positionMap['def-cb'] = [
            { top: 77, left: 25 }, { top: 77, left: 50 }, { top: 77, left: 75 }
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
        if (this.selectedFormationName === '4-4-2') {
            positionMap['mid'] = [
                { top: 45, left: 11 }, { top: 50, left: 37 }, { top: 50, left: 63 }, { top: 45, left: 89 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormationName === '4-3-3') {
            positionMap['mid-c'] = [
                { top: 45, left: 25 }, { top: 50, left: 50 }, { top: 45, left: 75 }
            ];
        } else if (this.selectedFormationName === '4-3-3-(2)') {
            positionMap['mid-c'] = [
                { top: 50, left: 25 }, { top: 40, left: 50 }, { top: 50, left: 75 }
            ];
        } else if (this.selectedFormationName === '3-5-2') {
            positionMap['mid-wb'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 30 }, { top: 55, left: 50 }, { top: 45, left: 70 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormationName === '4-2-3-1') {
            positionMap['mid-c'] = [
                { top: 55, left: 37 }, { top: 55, left: 63 }
            ];
            positionMap['mid-ac'] = [
                { top: 37, left: 25 }, { top: 32, left: 50 }, { top: 37, left: 75 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormationName === '4-1-4-1') {
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
        } else if (this.selectedFormationName === '3-4-3') {
            positionMap['mid-wb'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 50, left: 37 }, { top: 50, left: 63 }
            ];
        } else if (this.selectedFormationName === '5-3-2') {
            positionMap['def'] = [
                { top: 73, left: 8 }, { top: 77, left: 28 }, { top: 77, left: 50 }, { top: 77, left: 72 }, { top: 73, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 25 }, { top: 50, left: 50 }, { top: 45, left: 75 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormationName === '4-5-1') {
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
        } else if (this.selectedFormationName === '4-3-2-1') {
            positionMap['mid-c'] = [
                { top: 50, left: 25 }, { top: 55, left: 50 }, { top: 50, left: 75 }
            ];
            positionMap['mid-am'] = [
                { top: 30, left: 37 }, { top: 30, left: 63 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (this.selectedFormationName === '3-6-1') {
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
        } else if (this.selectedFormationName === '4-2-2-2') {
            positionMap['mid-c'] = [
                { top: 55, left: 42 }, { top: 55, left: 58 }
            ];
            positionMap['mid-ac'] = [
                { top: 40, left: 22 }, { top: 40, left: 78 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (this.selectedFormationName === '3-2-4-1') {
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
        } else if (this.selectedFormationName === '4-4-1-1') {
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
        } else if (this.selectedFormationName === '4-3-1-2') {
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
        } else if (this.selectedFormationName === '3-4-2-1') {
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
                    isDragging: false // Bu özellik olmalı
                });
            } else {
                console.warn(`Pozisyon verisi eksik veya fazla: Tip - ${playerDef.type}, Sıra - ${playerDef.order} for formation ${this.selectedFormationName}`);
            }


        });

        beforeChangeFormation.forEach(player => {
            if (player.playerInfo) {
                this.players[player.id].playerInfo = player.playerInfo;
            }
        });
    }

    // To Reset Transform Style Coming With CDK Drag
    onResetPlayersTransform() {
        this.showComponent = false;  // component yok olur
        setTimeout(() => {
            this.showComponent = true; // component yeniden oluşturulur
            this.calculatePlayerPositions();
        });
    }

    // To set or change Selected Team Jersey
    setTeamJerseyTemplate(teamJerseyTemplate: any) {
        this.selectedTeamJerseyTemplate = teamJerseyTemplate;
    }

    async onPlayerSearchClick(player: any) {
        if (this.hasDragging) return; // Avoid click and dragging at the same time
        const dialog = this._dialog.open(MgPlayerSearchComponent, {
            disableClose: false,
            width: '500px',
            height: '500px',
            panelClass: 'dark-dialog-panel'
        });

        dialog.afterClosed().subscribe((selectedPlayer) => {
            if (selectedPlayer) {
                this.players[player.id].playerInfo = selectedPlayer;
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
    async exportCaptureAsImage() {
        const element = this.pitchBoundaryForExport.nativeElement;

        try {
            const canvas = await html2canvas(element, {
                useCORS: true,
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
            console.error('Div resme dönüştürülürken bir hata oluştu:', error);
        }
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

    async onPlayerTest() {
        await this._playerService.getPlayers();
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
                this.changedPlayerIdList.push(player.id)
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

        // console.log(`Player id: ${event.source.element.nativeElement.id}`);
        // console.log(`X sapma: %${xPercent.toFixed(2)}`);
        // console.log(`Y sapma: %${yPercent.toFixed(2)}`);

        // const newLeft = parseFloat(player.style.left.replace('%', '')) + parseFloat(xPercent.toFixed(2));
        // console.log('1', parseFloat(player.style.left.replace('%', '')));
        // console.log('2', parseFloat(xPercent.toFixed(2)));
        // console.log('asd', newLeft);


        // const newTop = parseFloat(player.style.top.replace('%', '')) + yPercent.toFixed(2);
        // console.log('new', newTop);

        // player.style = {
        //     left: `${newLeft}%`,
        //     top: `${newTop}%`,
        //     transform: `translate(-50%, -50%)`,
        // };
        // console.log(player.style);

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
        // console.log(absoluteX, absoluteY);
        // console.log(percentLeft, percentTop);
        // player.position.left = percentLeft;
        // player.position.top = percentTop;
        // // player.style = {
        // //     left: `${percentLeft}%`,
        // //     top: `${percentTop}%`,
        // //     transform: `translate(-50%, -50%)`,
        // // };
        // player.isDragging = false;


        // player.isDragging = false;

        // // if (this.checkCollision(player)) {
        // //     console.log('çakışma');

        // //     // Geri dönüş için yeni obje ata ki Angular algılasın
        // //     if (player.lastPosition) {
        // //         player.position = {
        // //             top: player.lastPosition.top,
        // //             left: player.lastPosition.left,
        // //             transform: '' // artık kullanmıyoruz
        // //         };
        // //     }
        // // }

        // console.log(this.players);

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
                //     console.log(
                //         `Çakışma: Oyuncu ${current.id} → Oyuncu ${other.id} (sol: ${currentLeft.toFixed(1)}px / ${otherLeft.toFixed(1)}px)`
                //     );
                // }

                return false;
        });

    }



}