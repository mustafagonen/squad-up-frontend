import { Injectable } from '@angular/core';

export interface Position {
    top: number;
    left: number;
}

@Injectable({ providedIn: 'root' })
export class FormationPositionService {
    getPositionMap(formation: string): { [type: string]: Position[] } {
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
        if (formation === '4-4-2') {
            positionMap['mid'] = [
                { top: 45, left: 11 }, { top: 50, left: 37 }, { top: 50, left: 63 }, { top: 45, left: 89 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (formation === '4-3-3') {
            positionMap['mid-c'] = [
                { top: 45, left: 25 }, { top: 50, left: 50 }, { top: 45, left: 75 }
            ];
        } else if (formation === '4-3-3-(2)') {
            positionMap['mid-c'] = [
                { top: 50, left: 25 }, { top: 45, left: 50 }, { top: 50, left: 75 }
            ];
        } else if (formation === '3-5-2') {
            positionMap['mid-wb'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 30 }, { top: 55, left: 50 }, { top: 45, left: 70 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (formation === '4-2-3-1') {
            positionMap['mid-c'] = [
                { top: 55, left: 37 }, { top: 55, left: 63 }
            ];
            positionMap['mid-ac'] = [
                { top: 37, left: 25 }, { top: 32, left: 50 }, { top: 37, left: 75 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (formation === '4-1-4-1') {
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
        } else if (formation === '3-4-3') {
            positionMap['mid-wb'] = [
                { top: 45, left: 8 }, { top: 45, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 50, left: 37 }, { top: 50, left: 63 }
            ];
        } else if (formation === '5-3-2') {
            positionMap['def'] = [
                { top: 73, left: 8 }, { top: 75, left: 28 }, { top: 75, left: 50 }, { top: 75, left: 72 }, { top: 73, left: 92 }
            ];
            positionMap['mid-c'] = [
                { top: 45, left: 25 }, { top: 50, left: 50 }, { top: 45, left: 75 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (formation === '4-5-1') {
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
        } else if (formation === '4-3-2-1') {
            positionMap['mid-c'] = [
                { top: 50, left: 25 }, { top: 55, left: 50 }, { top: 50, left: 75 }
            ];
            positionMap['mid-am'] = [
                { top: 30, left: 37 }, { top: 30, left: 63 }
            ];
            positionMap['fw'] = [
                { top: 13, left: 50 }
            ];
        } else if (formation === '3-6-1') {
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
        } else if (formation === '4-2-2-2') {
            positionMap['mid-c'] = [
                { top: 55, left: 42 }, { top: 55, left: 58 }
            ];
            positionMap['mid-ac'] = [
                { top: 40, left: 22 }, { top: 40, left: 78 }
            ];
            positionMap['fw'] = [
                { top: 20, left: 37 }, { top: 20, left: 63 }
            ];
        } else if (formation === '3-2-4-1') {
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
        } else if (formation === '4-4-1-1') {
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
        } else if (formation === '4-3-1-2') {
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
        } else if (formation === '3-4-2-1') {
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
        return positionMap;
    }
}
