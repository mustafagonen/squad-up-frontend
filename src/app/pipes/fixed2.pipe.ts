import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fixed2'
})
export class Fixed2Pipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '-';

        value = value.toFixed(2);
        return value;
    }

}