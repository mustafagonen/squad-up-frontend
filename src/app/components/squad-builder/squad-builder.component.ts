import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDialog } from '@angular/material/dialog';
import { MgPlayerSearchComponent } from '../player-search-dialog/player-search-dialog.component';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { nanoid } from 'nanoid';
import { SquadModel } from '../../models/squad.model';
import { ActivatedRoute } from '@angular/router';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';
import { MgShareSquadModalComponent } from '../squad-saved-dialog/share-squad-modal.component';
import { UtilitiesService } from '../../utilities/utilities.service';
import { FORMATION_LABELS } from '../../constants/formations-labels';
import { FORMATION_POSITIONS } from '../../constants/formations';
import { TEAM_JERSEY_TEMPLATES } from '../../constants/team-jersey-template';
import { Player } from '../../models/player.model';
import { FirebaseService } from '../../services/firebase.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
    selector: 'mg-squad-builder',
    templateUrl: './squad-builder.component.html',
    styleUrls: ['./squad-builder.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})

export class MgSquadBuilderComponent implements OnInit {

    @ViewChild('teamNameInput') teamNameInput!: ElementRef;
    @ViewChild('pitchBoundaryForExport') pitchBoundaryForExport!: ElementRef;

    // States Variables
    isLoading = false;
    showComponent = true;
    isSquadFromUrl = false;
    isMobileView = false;
    squadFirebaseId: any;
    isShowBenchPlayers = false;
    isDragEnabled: boolean = false;
    hasDragging: boolean = false;
    isJerseyMode: boolean = false;
    isEditingTeamName: boolean = false;
    currentTeamName: any = 'Takımınız';

    formationLabels = FORMATION_LABELS;
    formations = FORMATION_POSITIONS;
    players: Player[] = [];
    benchPlayers: Player[] = [];
    changedPlayerIdList: any = [];
    selectedFormation: string = '4-4-2';
    squadModel = new SquadModel();
    teamJerseyTemplates = TEAM_JERSEY_TEMPLATES;
    selectedTeamJerseyTemplate = TEAM_JERSEY_TEMPLATES[0];

    constructor(
        private _dialog: MatDialog,
        private _toastrService: ToastrService,
        private _activatedRoute: ActivatedRoute,
        private _firebaseService: FirebaseService,
        private _utilitiesService: UtilitiesService,
    ) { }

    async ngOnInit() {
        this.isLoading = true;
        await this.checkMobileView();
        await this.checkSquadFromUrlOrNot()
        await this.setFormation(this.selectedFormation);
        this.isLoading = false;
    }

    // Check Mobile View
    async checkMobileView() {
        this._utilitiesService.isMobile$.subscribe(value => {
            this.isMobileView = value;
        });
    }

    // Check Squad is from Url or Not
    async checkSquadFromUrlOrNot() {
        this._activatedRoute.paramMap.subscribe(async (params) => {
            this.squadFirebaseId = params.get('id');
            if (this.squadFirebaseId) {
                const result = await this.getSquadFromUrl(this.squadFirebaseId);

                if (result && result?.length > 0) {
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

    // Get squad If from Url 
    async getSquadFromUrl(squadId: any) {
        if (!squadId) { return; }
        return (
            await getDocs(query(collection(this._firebaseService.firestore, 'squad'), where("id", "==", squadId)))
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
    async setTeamJerseyTemplate(teamJerseyTemplate: any) {
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

    // Start Editing Title
    async startEditingTeamName() {
        this.isEditingTeamName = true;
        // Input alanı DOM'a eklendikten sonra odaklanmak için küçük bir gecikme
        setTimeout(() => {
            this.teamNameInput.nativeElement.focus();
        }, 0);
    }

    // Stop Editing Title
    async stopEditingTeamName() {
        this.isEditingTeamName = false;
        // Eğer kullanıcı boş bir isim bıraktıysa varsayılanı geri yükle
        if (this.currentTeamName.trim() === '') {
            this.currentTeamName = 'Takımınız';
        }
    }

    // Export As Image
    async exportAsPng(fromSaveSquad?: any) {
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
                link.click();
                // if (!fromSaveSquad) {
                //     const img = document.createElement('img');
                //     img.src = dataUrl;
                //     img.style.maxWidth = '100%';
                //     img.style.marginTop = '16px';
                //     const hedefDiv = document.getElementById('iphone-image-area');

                //     if (hedefDiv) {
                //         hedefDiv.innerHTML = '';
                //         hedefDiv.appendChild(img);
                //     }
                // }
            });
    }

    // Export As Image Alternative package library
    async exportCaptureAsImageClick() {
        this.isLoading = true;
        const element = this.pitchBoundaryForExport.nativeElement;
        try {
            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                scale: 2,
                backgroundColor: '#0d1222',
            });
            const imageData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageData;
            link.download = 'div-content.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

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
            await setDoc(doc(this._firebaseService.firestore, "squad", dbId), squadData);
            this._toastrService.success('Kadronuz başarıyla kaydedildi.');

            const dialog = this._dialog.open(MgShareSquadModalComponent, {
                disableClose: false,
                maxWidth: '90vw',
                maxHeight: '80vh',
                panelClass: 'dark-dialog-panel'
            });
            dialog.componentInstance.generatedShareLink = environment.appUrl + 'kadro-kur/' + dbId;

        } catch (error) {
            console.error(error);
        }
    }

    // Continue New Team Without Saved Squad
    async onCreateNewTeam() {
        window.location.href = '/kadro-kur'
    }

    // Activate Alternative Player
    async activateAlternativePlayerTextarea(player: any) {
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
    async toggleBenchPlayers() {
        this.isShowBenchPlayers = !this.isShowBenchPlayers;
    }

}