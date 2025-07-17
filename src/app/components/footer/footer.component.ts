import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'mg-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true

})
export class MgFooterComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
