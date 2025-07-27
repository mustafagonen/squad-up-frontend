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

    @ViewChild('teamNameInputA') teamNameInputA!: ElementRef;
    @ViewChild('teamNameInputB') teamNameInputB!: ElementRef;
    @ViewChild('pitchBoundaryForExport') pitchBoundaryForExport!: ElementRef;

    // States Variables
    isLoading = false;
    showComponent = true;
    isMobileView = false;
    isShowBenchPlayers = false;
    hasDragging: boolean = false;
    isJerseyMode: boolean = false;
    isEditingTeamNameA: boolean = false;
    isEditingTeamNameB: boolean = false;
    playerWidth = 70;
    playerHeight = 70;
    pitchWidth = 514; // 2px for borders
    pitchHeight = 618; // 2px for borders

    currentTeamNameA: any = 'Takımınız';
    currentTeamNameB: any = 'Takımınız';
    selectedFormationA: string = '5-3-2';
    selectedFormationB: string = '5-3-2';
    isDragEnabledTeamA: boolean = false;
    isDragEnabledTeamB: boolean = false;
    playersA: {
        id: number,
        type: string,
        style: any,
        position: { top: any, left: any, transform: string },
        isDragging: boolean,
        playerInfo?: any,
        lastPosition?: any
    }[] = [];

    playersB: {
        id: number,
        type: string,
        style: any,
        position: { top: any, right: any, transform: string },
        isDragging: boolean,
        playerInfo?: any,
        lastPosition?: any
    }[] = [];


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

    changedPlayerIdList: any = [];

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

    selectedTeamJerseyTemplateA = this.teamJerseyTemplates[0];
    selectedTeamJerseyTemplateB = this.teamJerseyTemplates[1];

    constructor(
        private _dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.setFormationA(this.selectedFormationA);
        this.setFormationB(this.selectedFormationB);

    }

    // Set Selected Formation
    async setFormationA(formationName: string, resetAlsoPlayers?: any) {
        this.selectedFormationA = formationName;
        if (resetAlsoPlayers) {
            this.showComponent = false;
            await this.calculatePlayerPositionsA(resetAlsoPlayers);
            this.showComponent = true;
        }
        else {
            await this.calculatePlayerPositionsA();
        }
    }

    async setFormationB(formationName: string, resetAlsoPlayers?: any) {
        this.selectedFormationB = formationName;
        if (resetAlsoPlayers) {
            this.showComponent = false;
            await this.calculatePlayerPositionsB(resetAlsoPlayers);
            this.showComponent = true;
        }
        else {
            await this.calculatePlayerPositionsB();
        }
    }

    // Set Players Position With Formations TEAM A
    async calculatePlayerPositionsA(alsoResetPlayers?: any) {

        const beforeChangeFormationA = this.playersA;
        this.playersA = [];
        const formationData = this.formations[this.selectedFormationA];

        if (!formationData) {
            console.warn(`Diziliş bulunamadı: ${this.selectedFormationA}`);
            return;
        }

        const positionMap: { [type: string]: { top: number, left: number }[] } = {};

        // Helper function to adjust left coordinate
        const adjustLeft = (originalLeft: number, type: string) => {
            if (type == 'fw') {
                return originalLeft - 35;
            }
            else if (type == 'fw-s') {
                return originalLeft - 35.5;
            }
            else if (type == 'fw-w') {
                return originalLeft - 33;
            }
            else if (type == 'mid') {
                return originalLeft - 20;
            }
            else if (type == 'mid-c') {
                return originalLeft - 21;
            }
            else if (type == 'mid-ac') {
                return originalLeft - 20;
            }
            else if (type == 'def') {
                return originalLeft - 10
            }
            else if (type == 'def-cb') {
                return originalLeft - 8
            }
            return originalLeft; // No change for other types
        };

        // Genel Pozisyonlar
        positionMap['gk'] = [{ top: 50, left: adjustLeft(5.5, 'gk') }];
        positionMap['def'] = [
            { top: 11, left: adjustLeft(27, 'def') }, { top: 37, left: adjustLeft(23, 'def') }, { top: 63, left: adjustLeft(23, 'def') }, { top: 89, left: adjustLeft(27, 'def') }
        ];
        positionMap['def-cb'] = [
            { top: 25, left: adjustLeft(23, 'def-cb') }, { top: 50, left: adjustLeft(23, 'def-cb') }, { top: 75, left: adjustLeft(23, 'def-cb') }
        ];
        positionMap['def-wb'] = [
            { top: 10, left: adjustLeft(40, 'def-wb') }, { top: 90, left: adjustLeft(40, 'def-wb') }
        ];
        positionMap['mid-c'] = [
            { top: 25, left: adjustLeft(50, 'mid-c') }, { top: 50, left: adjustLeft(50, 'mid-c') }, { top: 75, left: adjustLeft(50, 'mid-c') }
        ];
        positionMap['mid-w'] = [
            { top: 11, left: adjustLeft(55, 'mid-w') }, { top: 89, left: adjustLeft(55, 'mid-w') }
        ];
        positionMap['mid-dm'] = [
            { top: 50, left: adjustLeft(45, 'mid-dm') }, { top: 37, left: adjustLeft(45, 'mid-dm') }, { top: 63, left: adjustLeft(45, 'mid-dm') }
        ];
        positionMap['mid-am'] = [
            { top: 50, left: adjustLeft(75, 'mid-am') }, { top: 37, left: adjustLeft(75, 'mid-am') }, { top: 63, left: adjustLeft(75, 'mid-am') },
            { top: 20, left: adjustLeft(70, 'mid-am') }, { top: 50, left: adjustLeft(75, 'mid-am') }, { top: 80, left: adjustLeft(70, 'mid-am') }
        ];
        positionMap['mid-am-w'] = [
            { top: 30, left: adjustLeft(65, 'mid-am-w') }, { top: 70, left: adjustLeft(65, 'mid-am-w') }
        ];
        positionMap['fw'] = [
            { top: 50, left: adjustLeft(82, 'fw') }, { top: 37, left: adjustLeft(82, 'fw') }, { top: 63, left: adjustLeft(82, 'fw') }
        ];
        positionMap['fw-w'] = [
            { top: 20, left: adjustLeft(75, 'fw-w') }, { top: 80, left: adjustLeft(75, 'fw-w') }
        ];
        positionMap['fw-s'] = [
            { top: 50, left: adjustLeft(82, 'fw-s') }
        ];

        // Detaylı Formasyonlar Config (Sahanın genel yönüne göre ayarlandı)
        if (this.selectedFormationA === '4-4-2') {
            positionMap['mid'] = [
                { top: 11, left: adjustLeft(55, 'mid') }, { top: 37, left: adjustLeft(50, 'mid') }, { top: 63, left: adjustLeft(50, 'mid') }, { top: 89, left: adjustLeft(55, 'mid') }
            ];
            positionMap['fw'] = [
                { top: 37, left: adjustLeft(80, 'fw') }, { top: 63, left: adjustLeft(80, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-3-3') {
            positionMap['mid-c'] = [
                { top: 25, left: adjustLeft(50, 'mid-c') }, { top: 50, left: adjustLeft(45, 'mid-c') }, { top: 75, left: adjustLeft(50, 'mid-c') }
            ];
        } else if (this.selectedFormationA === '4-3-3-(2)') {
            positionMap['mid-c'] = [
                { top: 25, left: adjustLeft(50, 'mid-c') }, { top: 50, left: adjustLeft(55, 'mid-c') }, { top: 75, left: adjustLeft(50, 'mid-c') }
            ];
        } else if (this.selectedFormationA === '3-5-2') {
            positionMap['mid-wb'] = [
                { top: 10, left: adjustLeft(32, 'mid-wb') }, { top: 90, left: adjustLeft(32, 'mid-wb') }
            ];
            positionMap['mid-c'] = [
                { top: 30, left: adjustLeft(51, 'mid-c') }, { top: 50, left: adjustLeft(47, 'mid-c') }, { top: 70, left: adjustLeft(51, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 37, left: adjustLeft(80, 'fw') }, { top: 63, left: adjustLeft(80, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-2-3-1') {
            positionMap['mid-c'] = [
                { top: 37, left: adjustLeft(45, 'mid-c') }, { top: 63, left: adjustLeft(45, 'mid-c') }
            ];
            positionMap['mid-ac'] = [
                { top: 25, left: adjustLeft(53, 'mid-ac') }, { top: 50, left: adjustLeft(56, 'mid-ac') }, { top: 75, left: adjustLeft(53, 'mid-ac') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-1-4-1') {
            positionMap['mid-dm'] = [
                { top: 50, left: adjustLeft(25, 'mid-dm') }
            ];
            positionMap['mid-w'] = [
                { top: 11, left: adjustLeft(38, 'mid-w') }, { top: 89, left: adjustLeft(38, 'mid-w') }
            ];
            positionMap['mid-c'] = [
                { top: 37, left: adjustLeft(55, 'mid-c') }, { top: 63, left: adjustLeft(55, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '3-4-3') {
            positionMap['mid-wb'] = [
                { top: 10, left: adjustLeft(31, 'mid-wb') }, { top: 90, left: adjustLeft(31, 'mid-wb') }
            ];
            positionMap['mid-c'] = [
                { top: 37, left: adjustLeft(50, 'mid-c') }, { top: 63, left: adjustLeft(50, 'mid-c') }
            ];
        } else if (this.selectedFormationA === '5-3-2') {
            positionMap['def'] = [
                { top: 10, left: adjustLeft(27, 'def') }, { top: 28, left: adjustLeft(23, 'def') }, { top: 50, left: adjustLeft(23, 'def') }, { top: 72, left: adjustLeft(23, 'def') }, { top: 90, left: adjustLeft(27, 'def') }
            ];
            positionMap['mid-c'] = [
                { top: 25, left: adjustLeft(55, 'mid-c') }, { top: 50, left: adjustLeft(50, 'mid-c') }, { top: 75, left: adjustLeft(55, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 37, left: adjustLeft(80, 'fw') }, { top: 63, left: adjustLeft(80, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-5-1') {
            positionMap['mid-dm'] = [
                { top: 50, left: adjustLeft(22, 'mid-dm') }
            ];
            positionMap['mid-c'] = [
                { top: 30, left: adjustLeft(50, 'mid-c') }, { top: 70, left: adjustLeft(50, 'mid-c') }
            ];
            positionMap['mid-w'] = [
                { top: 11, left: adjustLeft(37, 'mid-w') }, { top: 89, left: adjustLeft(37, 'mid-w') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-3-2-1') {
            positionMap['mid-c'] = [
                { top: 25, left: adjustLeft(48, 'mid-c') }, { top: 50, left: adjustLeft(45, 'mid-c') }, { top: 75, left: adjustLeft(48, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 37, left: adjustLeft(38, 'mid-am') }, { top: 63, left: adjustLeft(38, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '3-6-1') {
            positionMap['mid-dm'] = [
                { top: 37, left: adjustLeft(36, 'mid-dm') }, { top: 63, left: adjustLeft(36, 'mid-dm') }
            ];
            positionMap['mid-c'] = [
                { top: 37, left: adjustLeft(46, 'mid-c') }, { top: 63, left: adjustLeft(46, 'mid-c') }
            ];
            positionMap['mid-w'] = [
                { top: 10, left: adjustLeft(29, 'mid-w') }, { top: 90, left: adjustLeft(29, 'mid-w') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-2-2-2') {
            positionMap['mid-c'] = [
                { top: 42, left: adjustLeft(45, 'mid-c') }, { top: 58, left: adjustLeft(45, 'mid-c') }
            ];
            positionMap['mid-ac'] = [
                { top: 22, left: adjustLeft(53, 'mid-ac') }, { top: 78, left: adjustLeft(53, 'mid-ac') }
            ];
            positionMap['fw'] = [
                { top: 37, left: adjustLeft(80, 'fw') }, { top: 63, left: adjustLeft(80, 'fw') }
            ];
        } else if (this.selectedFormationA === '3-2-4-1') {
            positionMap['mid-dm'] = [
                { top: 37, left: adjustLeft(26, 'mid-dm') }, { top: 63, left: adjustLeft(26, 'mid-dm') }
            ];
            positionMap['mid-w'] = [
                { top: 10, left: adjustLeft(40, 'mid-w') }, { top: 90, left: adjustLeft(40, 'mid-w') }
            ];
            positionMap['mid-c'] = [
                { top: 40, left: adjustLeft(58, 'mid-c') }, { top: 60, left: adjustLeft(58, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-4-1-1') {
            positionMap['mid-w'] = [
                { top: 11, left: adjustLeft(50, 'mid-w') }, { top: 89, left: adjustLeft(50, 'mid-w') }
            ];
            positionMap['mid-c'] = [
                { top: 37, left: adjustLeft(50, 'mid-c') }, { top: 63, left: adjustLeft(50, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 50, left: adjustLeft(70, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(87, 'fw') }
            ];
        } else if (this.selectedFormationA === '4-3-1-2') {
            positionMap['mid-dm'] = [
                { top: 50, left: adjustLeft(25, 'mid-dm') }
            ];
            positionMap['mid-c'] = [
                { top: 30, left: adjustLeft(50, 'mid-c') }, { top: 70, left: adjustLeft(50, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 50, left: adjustLeft(36, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 37, left: adjustLeft(81, 'fw') }, { top: 63, left: adjustLeft(81, 'fw') }
            ];
        } else if (this.selectedFormationA === '3-4-2-1') {
            positionMap['mid-wb'] = [
                { top: 10, left: adjustLeft(29, 'mid-wb') }, { top: 90, left: adjustLeft(29, 'mid-wb') }
            ];
            positionMap['mid-c'] = [
                { top: 37, left: adjustLeft(48, 'mid-c') }, { top: 63, left: adjustLeft(48, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 37, left: adjustLeft(38, 'mid-am') }, { top: 63, left: adjustLeft(38, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 50, left: adjustLeft(81, 'fw') }
            ];
        }

        let playerId = 0;

        formationData.forEach(playerDef => {
            const positionsOfType = positionMap[playerDef.type];
            if (positionsOfType && playerDef.order <= positionsOfType.length) {
                const pos = positionsOfType[playerDef.order - 1];
                this.playersA.push({
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
            } else {
                console.warn(`Pozisyon verisi eksik veya fazla: Tip - ${playerDef.type}, Sıra - ${playerDef.order} for formation ${this.selectedFormationA}`);
            }

        });

        if (!alsoResetPlayers) {
            beforeChangeFormationA.forEach(player => {
                if (player.playerInfo) {
                    // Ensure the new playersA array has an element at this ID before assigning
                    if (this.playersA[player.id]) {
                        this.playersA[player.id].playerInfo = player.playerInfo;
                    } else {
                        console.warn(`Player with ID ${player.id} not found in new formation, playerInfo not carried over.`);
                    }
                }
            });
        }
    }

    // Set Players Position With Formations TEAM B
    async calculatePlayerPositionsB(alsoResetPlayers?: any) {

        const beforeChangeFormationB = this.playersA;
        this.playersB = [];
        const formationData = this.formations[this.selectedFormationB];

        if (!formationData) {
            console.warn(`Diziliş bulunamadı: ${this.selectedFormationB}`);
            return;
        }

        // Changed 'left' to 'right' in the position map type definition
        const positionMap: { [type: string]: { top: number, right: number }[] } = {};

        // Helper function to adjust right coordinate (previously adjustLeft)
        const adjustRight = (originalRight: number, type: string) => {
            if (type == 'fw') {
                return originalRight - 46.5
            }
            else if (type == 'fw-s') {
                return originalRight - 47;
            }
            else if (type == 'fw-w') {
                return originalRight - 44;
            }
            else if (type == 'mid') {
                return originalRight - 26;
            }
            else if (type == 'mid-c') {
                return originalRight - 26;
            }
            else if (type == 'mid-ac') {
                return originalRight - 26;
            }
            else if (type == 'def') {
                return originalRight - 15.5;
            }
            else if (type == 'def-cb') {
                return originalRight - 14
            }
            return originalRight;
        };

        // Genel Pozisyonlar - All 'left' values converted to 'right' and passed to adjustRight
        positionMap['gk'] = [{ top: 50, right: adjustRight(0, 'gk') }];
        positionMap['def'] = [
            { top: 11, right: adjustRight(27, 'def') }, { top: 37, right: adjustRight(23, 'def') }, { top: 63, right: adjustRight(23, 'def') }, { top: 89, right: adjustRight(27, 'def') }
        ];
        positionMap['def-cb'] = [
            { top: 25, right: adjustRight(23, 'def-cb') }, { top: 50, right: adjustRight(23, 'def-cb') }, { top: 75, right: adjustRight(23, 'def-cb') }
        ];
        positionMap['def-wb'] = [
            { top: 10, right: adjustRight(40, 'def-wb') }, { top: 90, right: adjustRight(40, 'def-wb') }
        ];
        positionMap['mid-c'] = [
            { top: 25, right: adjustRight(50, 'mid-c') }, { top: 50, right: adjustRight(50, 'mid-c') }, { top: 75, right: adjustRight(50, 'mid-c') }
        ];
        positionMap['mid-w'] = [
            { top: 11, right: adjustRight(55, 'mid-w') }, { top: 89, right: adjustRight(55, 'mid-w') }
        ];
        positionMap['mid-dm'] = [
            { top: 50, right: adjustRight(45, 'mid-dm') }, { top: 37, right: adjustRight(45, 'mid-dm') }, { top: 63, right: adjustRight(45, 'mid-dm') }
        ];
        positionMap['mid-am'] = [
            { top: 50, right: adjustRight(75, 'mid-am') }, { top: 37, right: adjustRight(75, 'mid-am') }, { top: 63, right: adjustRight(75, 'mid-am') },
            { top: 20, right: adjustRight(70, 'mid-am') }, { top: 50, right: adjustRight(75, 'mid-am') }, { top: 80, right: adjustRight(70, 'mid-am') }
        ];
        positionMap['mid-am-w'] = [
            { top: 30, right: adjustRight(65, 'mid-am-w') }, { top: 70, right: adjustRight(65, 'mid-am-w') }
        ];
        positionMap['fw'] = [
            { top: 50, right: adjustRight(87, 'fw') }, { top: 37, right: adjustRight(87, 'fw') }, { top: 63, right: adjustRight(87, 'fw') }
        ];
        positionMap['fw-w'] = [
            { top: 20, right: adjustRight(80, 'fw-w') }, { top: 80, right: adjustRight(80, 'fw-w') }
        ];
        positionMap['fw-s'] = [
            { top: 50, right: adjustRight(87, 'fw-s') }
        ];

        // Detaylı Formasyonlar Config (Sahanın genel yönüne göre ayarlandı)
        // All 'left' values converted to 'right' and passed to adjustRight
        if (this.selectedFormationB === '4-4-2') {
            positionMap['mid'] = [
                { top: 11, right: adjustRight(55, 'mid') }, { top: 37, right: adjustRight(50, 'mid') }, { top: 63, right: adjustRight(50, 'mid') }, { top: 89, right: adjustRight(55, 'mid') }
            ];
            positionMap['fw'] = [
                { top: 37, right: adjustRight(85, 'fw') }, { top: 63, right: adjustRight(85, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-3-3') {
            positionMap['mid-c'] = [
                { top: 25, right: adjustRight(49, 'mid-c') }, { top: 50, right: adjustRight(45, 'mid-c') }, { top: 75, right: adjustRight(49, 'mid-c') }
            ];
        } else if (this.selectedFormationB === '4-3-3-(2)') {
            positionMap['mid-c'] = [
                { top: 25, right: adjustRight(49, 'mid-c') }, { top: 50, right: adjustRight(54, 'mid-c') }, { top: 75, right: adjustRight(49, 'mid-c') }
            ];
        } else if (this.selectedFormationB === '3-5-2') {
            positionMap['mid-wb'] = [
                { top: 10, right: adjustRight(25.5, 'mid-wb') }, { top: 90, right: adjustRight(25.5, 'mid-wb') }
            ];
            positionMap['mid-c'] = [
                { top: 30, right: adjustRight(50, 'mid-c') }, { top: 50, right: adjustRight(46, 'mid-c') }, { top: 70, right: adjustRight(50, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 37, right: adjustRight(85, 'fw') }, { top: 63, right: adjustRight(85, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-2-3-1') {
            positionMap['mid-c'] = [
                { top: 37, right: adjustRight(44, 'mid-c') }, { top: 63, right: adjustRight(44, 'mid-c') }
            ];
            positionMap['mid-ac'] = [
                { top: 25, right: adjustRight(53, 'mid-ac') }, { top: 50, right: adjustRight(56, 'mid-ac') }, { top: 75, right: adjustRight(53, 'mid-ac') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-1-4-1') {
            positionMap['mid-dm'] = [
                { top: 50, right: adjustRight(19, 'mid-dm') }
            ];
            positionMap['mid-w'] = [
                { top: 11, right: adjustRight(33, 'mid-w') }, { top: 89, right: adjustRight(33, 'mid-w') }
            ];
            positionMap['mid-c'] = [
                { top: 37, right: adjustRight(54, 'mid-c') }, { top: 63, right: adjustRight(54, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '3-4-3') {
            positionMap['mid-wb'] = [
                { top: 10, right: adjustRight(25, 'mid-wb') }, { top: 90, right: adjustRight(25, 'mid-wb') }
            ];
            positionMap['mid-c'] = [
                { top: 37, right: adjustRight(49, 'mid-c') }, { top: 63, right: adjustRight(49, 'mid-c') }
            ];
        } else if (this.selectedFormationB === '5-3-2') {
            positionMap['def'] = [
                { top: 10, right: adjustRight(27, 'def') }, { top: 28, right: adjustRight(23, 'def') }, { top: 50, right: adjustRight(23, 'def') }, { top: 72, right: adjustRight(23, 'def') }, { top: 90, right: adjustRight(27, 'def') }
            ];
            positionMap['mid-c'] = [
                { top: 25, right: adjustRight(53.5, 'mid-c') }, { top: 50, right: adjustRight(50, 'mid-c') }, { top: 75, right: adjustRight(53.5, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 37, right: adjustRight(85, 'fw') }, { top: 63, right: adjustRight(85, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-5-1') {
            positionMap['mid-dm'] = [
                { top: 50, right: adjustRight(16, 'mid-dm') }
            ];
            positionMap['mid-c'] = [
                { top: 30, right: adjustRight(49, 'mid-c') }, { top: 70, right: adjustRight(49, 'mid-c') }
            ];
            positionMap['mid-w'] = [
                { top: 11, right: adjustRight(35, 'mid-w') }, { top: 89, right: adjustRight(35, 'mid-w') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-3-2-1') {
            positionMap['mid-c'] = [
                { top: 25, right: adjustRight(47, 'mid-c') }, { top: 50, right: adjustRight(44, 'mid-c') }, { top: 75, right: adjustRight(47, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 37, right: adjustRight(32.5, 'mid-am') }, { top: 63, right: adjustRight(32.5, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '3-6-1') {
            positionMap['mid-dm'] = [
                { top: 37, right: adjustRight(19, 'mid-dm') }, { top: 63, right: adjustRight(19, 'mid-dm') }
            ];
            positionMap['mid-c'] = [
                { top: 37, right: adjustRight(56, 'mid-c') }, { top: 63, right: adjustRight(56, 'mid-c') }
            ];
            positionMap['mid-w'] = [
                { top: 10, right: adjustRight(35.5, 'mid-w') }, { top: 90, right: adjustRight(35.5, 'mid-w') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-2-2-2') {
            positionMap['mid-c'] = [
                { top: 42, right: adjustRight(44, 'mid-c') }, { top: 58, right: adjustRight(44, 'mid-c') }
            ];
            positionMap['mid-ac'] = [
                { top: 22, right: adjustRight(53, 'mid-ac') }, { top: 78, right: adjustRight(53, 'mid-ac') }
            ];
            positionMap['fw'] = [
                { top: 37, right: adjustRight(85, 'fw') }, { top: 63, right: adjustRight(85, 'fw') }
            ];
        } else if (this.selectedFormationB === '3-2-4-1') {
            positionMap['mid-dm'] = [
                { top: 37, right: adjustRight(20, 'mid-dm') }, { top: 63, right: adjustRight(20, 'mid-dm') }
            ];
            positionMap['mid-w'] = [
                { top: 10, right: adjustRight(34, 'mid-w') }, { top: 90, right: adjustRight(34, 'mid-w') }
            ];
            positionMap['mid-c'] = [
                { top: 40, right: adjustRight(57, 'mid-c') }, { top: 60, right: adjustRight(57, 'mid-c') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-4-1-1') {
            positionMap['mid-w'] = [
                { top: 11, right: adjustRight(50, 'mid-w') }, { top: 89, right: adjustRight(50, 'mid-w') }
            ];
            positionMap['mid-c'] = [
                { top: 37, right: adjustRight(50, 'mid-c') }, { top: 63, right: adjustRight(50, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 50, right: adjustRight(70, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(87, 'fw') }
            ];
        } else if (this.selectedFormationB === '4-3-1-2') {
            positionMap['mid-dm'] = [
                { top: 50, right: adjustRight(19, 'mid-dm') }
            ];
            positionMap['mid-c'] = [
                { top: 30, right: adjustRight(49, 'mid-c') }, { top: 70, right: adjustRight(49, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 50, right: adjustRight(30, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 37, right: adjustRight(86, 'fw') }, { top: 63, right: adjustRight(86, 'fw') }
            ];
        } else if (this.selectedFormationB === '3-4-2-1') {
            positionMap['mid-wb'] = [
                { top: 10, right: adjustRight(35, 'mid-wb') }, { top: 90, right: adjustRight(35, 'mid-wb') }
            ];
            positionMap['mid-c'] = [
                { top: 37, right: adjustRight(47, 'mid-c') }, { top: 63, right: adjustRight(47, 'mid-c') }
            ];
            positionMap['mid-am'] = [
                { top: 37, right: adjustRight(33, 'mid-am') }, { top: 63, right: adjustRight(33, 'mid-am') }
            ];
            positionMap['fw'] = [
                { top: 50, right: adjustRight(86, 'fw') }
            ];
        }

        let playerId = 0;

        formationData.forEach(playerDef => {
            const positionsOfType = positionMap[playerDef.type];
            if (positionsOfType && playerDef.order <= positionsOfType.length) {
                const pos = positionsOfType[playerDef.order - 1];
                this.playersB.push({
                    id: playerId++,
                    type: playerDef.type,
                    // Changed 'left' to 'right' here
                    position: { top: pos.top, right: pos.right, transform: `translate(-50%, -50%)` },
                    style: {
                        top: `${pos.top}%`,
                        // Changed 'left' to 'right' here
                        right: `${pos.right}%`,
                        transform: `translate(-50%, -50%)`
                    },
                    isDragging: false
                });
            } else {
                console.warn(`Pozisyon verisi eksik veya fazla: Tip - ${playerDef.type}, Sıra - ${playerDef.order} for formation ${this.selectedFormationA}`);
            }

        });

        if (!alsoResetPlayers) {
            beforeChangeFormationB.forEach(player => {
                if (player.playerInfo) {
                    if (this.playersA[player.id]) {
                        this.playersA[player.id].playerInfo = player.playerInfo;
                    } else {
                        console.warn(`Player with ID ${player.id} not found in new formation, playerInfo not carried over.`);
                    }
                }
            });
        }
    }

    // To Reset Transform Style Coming With CDK Drag
    onResetPlayersTransformA() {
        this.showComponent = false;  // component yok olur
        setTimeout(() => {
            this.showComponent = true; // component yeniden oluşturulur
            this.calculatePlayerPositionsA();
        });
    }

    onResetPlayersTransformB() {
        this.showComponent = false;  // component yok olur
        setTimeout(() => {
            this.showComponent = true; // component yeniden oluşturulur
            this.calculatePlayerPositionsB();
        });
    }

    // To set or change Selected Team Jersey
    setTeamJerseyTemplate(teamJerseyTemplate: any, type: any) {
        if (type == 'A') {
            this.selectedTeamJerseyTemplateA = teamJerseyTemplate;
        }

        else if (type == 'B') {
            this.selectedTeamJerseyTemplateB = teamJerseyTemplate;
        }
    }

    async onPlayerSearchClick(player: any, type: any) {
        if (this.hasDragging) return; // Avoid click and dragging at the same time
        const dialog = this._dialog.open(MgPlayerSearchComponent, {
            disableClose: false,
            width: '500px',
            maxWidth: '80vh',
            height: '500px',
            maxHeight: '90vw',
            panelClass: 'dark-dialog-panel'
        });

        dialog.afterClosed().subscribe((selectedPlayer) => {
            if (selectedPlayer) {
                if (type == 'A') {
                    this.playersA[player.id].playerInfo = selectedPlayer;
                }
                else if (type == 'B') {
                    this.playersB[player.id].playerInfo = selectedPlayer;

                }
            }
        });
    }

    // Start Editing Title A
    startEditingTeamNameA() {
        this.isEditingTeamNameA = true;
        setTimeout(() => {
            this.teamNameInputA.nativeElement.focus();
        }, 0);
    }

    // Stop Editing Title A
    stopEditingTeamNameA() {
        this.isEditingTeamNameA = false;
        // Eğer kullanıcı boş bir isim bıraktıysa varsayılanı geri yükle
        if (this.currentTeamNameA.trim() === '') {
            this.currentTeamNameA = 'Takımınız';
        }
    }

    // Start Editing Title B
    startEditingTeamNameB() {
        this.isEditingTeamNameB = true;
        setTimeout(() => {
            this.teamNameInputB.nativeElement.focus();
        }, 0);
    }

    // Stop Editing Title B
    stopEditingTeamNameB() {
        this.isEditingTeamNameB = false;
        // Eğer kullanıcı boş bir isim bıraktıysa varsayılanı geri yükle
        if (this.currentTeamNameB.trim() === '') {
            this.currentTeamNameB = 'Takımınız';
        }
    }

    // Export As Image
    async exportCaptureAsImageClick() {
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

    // Toggle Bench Players
    toggleBenchPlayers() {
        this.isShowBenchPlayers = !this.isShowBenchPlayers;
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

    onPlayerDragEnded(player: any, event: CdkDragEnd, type: any) {

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

            this.playersA[player.id].position = {
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

    checkCollision(current: any, type: any): boolean {
        // const playerSize = 70; // px cinsinden
        const pitchWidth = 514;
        const pitchHeight = 618;

        const currentLeft = (current.position.left / 100) * pitchWidth;
        const currentTop = (current.position.top / 100) * pitchHeight;
        // const currentRight = currentLeft + playerSize;
        // const currentBottom = currentTop + playerSize;
        const players = this.playersA;
        return players.some(other => {
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
                //         `Çakışma: Oyuncu ${current.id} → Oyuncu ${other.id} (sol: ${currentLeft.toFixed(1)}px / ${otherLeft.toFixed(1)}px)`
                //     );
                // }

                return false;
        });

    }



}