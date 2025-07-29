import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDialog } from '@angular/material/dialog';
import { MgPlayerSearchComponent } from '../player-search-dialog/player-search-dialog.component';
import html2canvas from 'html2canvas';
import { Player, PlayerA, PlayerB } from '../../models/player.model';
import { FORMATION_LABELS } from '../../constants/formations-labels';
import { FORMATION_POSITIONS } from '../../constants/formations';
import { TEAM_JERSEY_TEMPLATES } from '../../constants/team-jersey-template';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
    selector: 'mg-tactical-board',
    templateUrl: './tactical-board.component.html',
    styleUrls: ['./tactical-board.component.scss'],
    imports: [
        SharedModule,
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
    isDragEnabledTeamA: boolean = false;
    isDragEnabledTeamB: boolean = false;
    selectedFormationA: string = '4-4-2';
    selectedFormationB: string = '4-4-2';
    isEditingTeamNameA: boolean = false;
    isEditingTeamNameB: boolean = false;
    currentTeamNameA: any = 'Takımınız';
    currentTeamNameB: any = 'Takımınız';
    isTeamBVisible: boolean = true;
    isBallVisible: boolean = false;

    playersA: PlayerA[] = [];
    playersB: PlayerB[] = [];

    formationLabels = FORMATION_LABELS;
    formations = FORMATION_POSITIONS;

    changedPlayerIdList: any = [];
    teamJerseyTemplates = TEAM_JERSEY_TEMPLATES;
    selectedTeamJerseyTemplateA = TEAM_JERSEY_TEMPLATES[0];
    selectedTeamJerseyTemplateB = TEAM_JERSEY_TEMPLATES[1];

    constructor(
        private _dialog: MatDialog,
    ) { }

    async ngOnInit() {
        this.isLoading = true;
        await this.setFormationA(this.selectedFormationA);
        await this.setFormationB(this.selectedFormationB);
        this.isLoading = false;
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
    async onResetPlayersTransformA() {
        this.showComponent = false;  // component yok olur
        setTimeout(() => {
            this.showComponent = true; // component yeniden oluşturulur
            this.calculatePlayerPositionsA();
        });
    }

    // To Reset Transform Style Coming With CDK Drag
    async onResetPlayersTransformB() {
        this.showComponent = false;  // component yok olur
        setTimeout(() => {
            this.showComponent = true; // component yeniden oluşturulur
            this.calculatePlayerPositionsB();
        });
    }

    // To set or change Selected Team Jersey
    async setTeamJerseyTemplate(teamJerseyTemplate: any, type: any) {
        if (type == 'A') {
            this.selectedTeamJerseyTemplateA = teamJerseyTemplate;
        }

        else if (type == 'B') {
            this.selectedTeamJerseyTemplateB = teamJerseyTemplate;
        }
    }

    // Search Player API
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

    // Drag starts
    async onPlayerDragStarted(player: any) {
        player.isDragging = true;
        this.hasDragging = true;
        player.lastPosition = { top: player.position.top, left: player.position.left };
    }
    // Drag ends
    async onPlayerDragEnded(player: any, event: CdkDragEnd) {
        setTimeout(() => {
            player.isDragging = false;
            this.hasDragging = false;
            this.changedPlayerIdList.push(player.id);
        });
    }

    // Start Editing Title A
    async startEditingTeamNameA() {
        this.isEditingTeamNameA = true;
        setTimeout(() => {
            this.teamNameInputA.nativeElement.focus();
        }, 0);
    }

    // Stop Editing Title A
    async stopEditingTeamNameA() {
        this.isEditingTeamNameA = false;
        // Eğer kullanıcı boş bir isim bıraktıysa varsayılanı geri yükle
        if (this.currentTeamNameA.trim() === '') {
            this.currentTeamNameA = 'Takımınız';
        }
    }

    // Start Editing Title B
    async startEditingTeamNameB() {
        this.isEditingTeamNameB = true;
        setTimeout(() => {
            this.teamNameInputB.nativeElement.focus();
        }, 0);
    }

    // Stop Editing Title B
    async stopEditingTeamNameB() {
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
    async toggleBenchPlayers() {
        this.isShowBenchPlayers = !this.isShowBenchPlayers;
    }

    // Toggle Team B Visibility
    async toggleTeamBVisibility() {
        this.isTeamBVisible = !this.isTeamBVisible;
    }

    // Show ball in field
    async showBallInField() {
        this.isBallVisible = !this.isBallVisible;
    }

}