import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'mg-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})
export class MgFeaturesComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
