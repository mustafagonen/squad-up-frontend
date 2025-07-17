import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'noneSelect'
})
export class NoneSelectPipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '';
        if (value == 'None') {
            return 'Boş'
        }
        else {
            return value;
        }
    }

}