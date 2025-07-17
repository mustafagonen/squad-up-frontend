import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'amount'
})
export class AmountPipe implements PipeTransform {

    transform(value: any): any {
        if (!value) return '-';
        value = value.toFixed(2);

        let transformedValue = value.toString().replace(/\./g, ',');

        let parts = transformedValue.split(',');
        if (parts.length > 1) {
            let decimalPart = parts[1].substring(0, 2);
            transformedValue = `${parts[0]},${decimalPart}`;
        }
        let numStr = transformedValue.toString();
        let [integerPart, decimalPart] = numStr.split(',');
        let reversedInteger = integerPart.split('').reverse().join('');
        let grouped = reversedInteger.match(/.{1,3}/g);
        let formattedInteger = grouped.join('.').split('').reverse().join('');
        return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
    }

}