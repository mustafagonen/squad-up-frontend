import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class PlayerService {

    // private baseUrl = 'https://squad-up-backend.onrender.com/api';
    // private baseUrl = 'http://localhost:3000/api';

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


    constructor(
        private _httpClient: HttpClient
    ) { }

    async getPlayers(
        name: string = '',
        limit: number = 7,
        skip: number = 0,
        showIcons: boolean = true
    ): Promise<any> {
        const url = `${environment.apiUrl}/player?name=${name}&limit=${limit}&skip=${skip}&showIcons=${showIcons}`;
        try {
            const response = await firstValueFrom(this._httpClient.get<any>(url));
            return response;
        } catch (error) {
            console.error('İstek hatası:', error);
            return undefined;
        }
    }

}
