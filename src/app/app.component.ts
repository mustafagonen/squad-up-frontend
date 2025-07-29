import { Component } from '@angular/core';
import { SharedModule } from './shared.module';
import { LoaderService } from './loader/loader.service';
import { NavigationEnd, Router } from '@angular/router';
import { AppService } from './services/app.service';
import { MgNavbarComponent } from "./components/navbar/navbar.component";
import { MgFooterComponent } from "./components/footer/footer.component";
import { filter } from 'rxjs';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    SharedModule,
    MgNavbarComponent,
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
    private _loaderService: LoaderService
  ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      gtag('event', 'page_view', {
        page_path: event.urlAfterRedirects,
      });
    });
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
