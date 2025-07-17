import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'apiUrl' })
export class ApiUrlPipe implements PipeTransform {

    constructor() { }

    transform(value: string): string {

        return value.startsWith('/') ? '' : '';
    }
}