import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'leadingZero'
})
export class LeadingZeroPipe implements PipeTransform {

    transform(value: any): any {
        return (value < 10) ? ("0" + value) : value;
    }

}