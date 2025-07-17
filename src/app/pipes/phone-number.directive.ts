// phone-format.directive.ts
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        let input = event.target.value;

        // Sadece rakamları al
        let numericInput = input.replace(/\D/g, '');

        // Numaranın uzunluğunu kontrol et ve 10 haneli olmasını sağla
        if (numericInput.length > 10) {
            numericInput = numericInput.slice(-10); // Sadece son 10 haneyi al
        }

        // Formatla
        let formattedInput = numericInput
            .replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1-$2-$3-$4');

        // Değeri input alanına yerleştir
        this.el.nativeElement.value = formattedInput;

        // Olayın diğer dinleyiciler tarafından işlenmesini engelle
        event.stopPropagation();
    }
}
