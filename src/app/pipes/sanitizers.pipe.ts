import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml' })
export class HtmlSanitizePipe implements PipeTransform {
    constructor(
        private _sanitizer: DomSanitizer
    ) { }

    transform(value: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }
}

@Pipe({ name: 'sanitizeUrl' })
export class UrlSanitizePipe implements PipeTransform {
    constructor(
        private _sanitizer: DomSanitizer
    ) { }

    transform(value: string): SafeUrl {
        return this._sanitizer.bypassSecurityTrustUrl(value);
    }
}

@Pipe({ name: 'sanitizeResourceUrl' })
export class ResourceUrlSanitizePipe implements PipeTransform {
    constructor(
        private _sanitizer: DomSanitizer
    ) { }

    transform(value: string): SafeResourceUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
    }
}

@Pipe({ name: 'sanitizeScript' })
export class ScriptSanitizePipe implements PipeTransform {
    constructor(
        private _sanitizer: DomSanitizer
    ) { }

    transform(value: string): SafeScript {
        return this._sanitizer.bypassSecurityTrustScript(value);
    }
}

@Pipe({ name: 'sanitizeStyle' })
export class StyleSanitizePipe implements PipeTransform {
    constructor(
        private _sanitizer: DomSanitizer
    ) { }

    transform(value: string): SafeStyle {
        return this._sanitizer.bypassSecurityTrustStyle(value);
    }
}