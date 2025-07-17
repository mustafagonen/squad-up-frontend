import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeLeadZero' })
export class RemoveLeadZeroNumberPipe implements PipeTransform {
    constructor(
    ) { }

    transform(phoneNumberString: string): any {

        // if (phoneNumberString && phoneNumberString.length > 10) { return phoneNumberString.slice(0, -1); }

        if (phoneNumberString == '') {
            return null;
        }

        if (phoneNumberString == '0') {
            return null;

        }

        if (phoneNumberString == '00') {
            return null;
        }

    }
}