import { Component } from '@angular/core';
import { SharedModule } from './shared.module';
import { LoaderService } from './loader/loader.service';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { MgNavbarComponent } from "./components/navbar/navbar.component";
import { MgSliderComponent } from './components/slider/slider.component';
import { MgFeaturesComponent } from "./components/features/features.component";
import { MgFooterComponent } from "./components/footer/footer.component";
import { MgSquadBuilderComponent } from "./components/squad-builder/squad-builder.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    SharedModule,
    MgNavbarComponent,
    // MgSliderComponent,
    // MgFeaturesComponent,
    MgFooterComponent,
  ],
  standalone: true
})
export class AppComponent {

  title = 'tactical';
  isLogin: any = false;
  isLoginUrl: any = '';

  constructor(
    private _router: Router,
    private _appService: AppService,
    private _loaderService: LoaderService
  ) {
  }

  public get isLoading(): boolean {
    return this._loaderService.isLoading;
  }

  async ngOnInit() {
    console.log("%c" + "Tactical!", "color: #0093C9; -webkit-text-stroke: 1px #10B981; font-size: 24px; font-weight: bold;");
    console.log("%c" + "Dikkat!", "color: #DB2323; -webkit-text-stroke: 1px #10B981; font-size: 24px; font-weight: bold;");
    console.log("%c" + "Bu geliştiriciler için tasarlanmış bir tarayıcı özelliğidir..!", "color: #fff; font-size: 16px; font-weight: 400;");
  }
}
