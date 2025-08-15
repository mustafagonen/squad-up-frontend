import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

    transform(value: string): string {
        if (!value) return '';

        return value
            .split(' ')
            .map(word => {
                if (!word) return '';
                const firstChar = word.charAt(0);
                const rest = word.slice(1);
                return firstChar === firstChar.toLowerCase()
                    ? firstChar.toUpperCase() + rest
                    : word;
            })
            .join(' ');
    }

}
