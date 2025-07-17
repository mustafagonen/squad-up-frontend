import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(
        private _httpClient: HttpClient,
        private _toastrService: ToastrService,
    ) { }

    public async postFile(file: File): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await firstValueFrom(this._httpClient.post<any>(`${environment.apiUrl}FileOperationsLogs`, formData));
            return res.data;
        } catch (error: any) {
            this._toastrService.error(error);
            return error;
        }
    }

    public async downloadFile(eTag: string, fileName?: any): Promise<void> {
        this._httpClient.get(environment.apiUrl + 'FileOperationsLogs/' + eTag, { responseType: 'arraybuffer' })
            .subscribe((response: ArrayBuffer) => {
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            });
    }
}
