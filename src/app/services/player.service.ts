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

    constructor(
        private _httpClient: HttpClient
    ) { }

    async getPlayers(
        name: string = '',
        limit: number = 7,
        skip: number = 0,
        showIcons: boolean = true
    ): Promise<any> {
        const url = `${environment.apiUrl}/players?name=${name}&limit=${limit}&skip=${skip}&showIcons=${showIcons}`;
        try {
            const response = await firstValueFrom(this._httpClient.get<any>(url));
            return response;
        } catch (error) {
            console.error('İstek hatası:', error);
            return undefined;
        }
    }

}
