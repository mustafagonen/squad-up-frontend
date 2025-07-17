import { ErrorHandler, Inject, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export class AppErrorHandler implements ErrorHandler {
    constructor(@Inject(Injector) private injector: Injector) { }

    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

    public handleError(error: any): void {
        this.toastrService.error('Show me an error message');
        throw error;
    }
}