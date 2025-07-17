import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class PaginationService {

    constructor(
    ) { }

    public convertPaginatonModelToRequestUrl(paginationModel: PaginationModel) {
        if (paginationModel.pageSize == null || paginationModel.pageIndex == null) {
            return null;
        }
        else {
            const paginationUrl = `?pageSize=${paginationModel.pageSize}&pageIndex=${paginationModel.pageIndex}`
            return paginationUrl;
        }
    }
}

export class PaginationModel {
    public pageSize: number = 10;
    public pageIndex: number = 0;
}
