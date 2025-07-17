import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneNumber' })
export class PhoneNumberPipe implements PipeTransform {
    constructor(
    ) { }

    transform(phoneNumberString: string): any {

        // if (phoneNumberString && phoneNumberString.length > 10) { return phoneNumberString.slice(0, -1); }
        let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        let match = cleaned.match(/^(90|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

        if (match && phoneNumberString && phoneNumberString![0] != '0') {
            const res = ['+90', ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('');
            // const res = [match[0].startsWith('0') ? '+9' : '+90', ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('');
            return res;
        }

        if (match && phoneNumberString && phoneNumberString![0] == '0') {
            const res = ['+9', ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('');
            // const res = [match[0].startsWith('0') ? '+9' : '+90', ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('');
            return res;
        }

        return null;

    }
}