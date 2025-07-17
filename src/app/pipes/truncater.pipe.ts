import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncater'
})
export class TruncatePipe implements PipeTransform {

    transform(value: any, length: number = 0): any {
        if (!value) {
            return '';
        }
        return value.substring(0, length)
    }

}