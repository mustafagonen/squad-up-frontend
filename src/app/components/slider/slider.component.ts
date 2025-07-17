import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'mg-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true

})
export class MgSliderComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
