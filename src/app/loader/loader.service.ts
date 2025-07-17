import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class LoaderService {

    private _isLoading: any = false;
    public get isLoading(): any {
        return this._isLoading;
    }

    constructor(
    ) { }

    public addLoading() {
        this._isLoading = true;
    }

    public removeLoading() {
        this._isLoading = false;
    }

}