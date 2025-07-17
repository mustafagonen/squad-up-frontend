import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class AppService {

    public innerWidth: any;

    private _selectedMenu: any = '';
    public get selectedMenu(): any {
        return this._selectedMenu;
    }

    private _view: any = '';
    public get view(): any {
        return this._view;
    }

    constructor(
    ) { }

    public setMenuToApp(menu: any) {
        this._selectedMenu = menu;
    }

    public getMenuFromApp() {
        return this._selectedMenu;
    }

    public async getMenuTitleFromUrl(url: any) {
    }

}
