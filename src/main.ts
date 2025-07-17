import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/en'
registerLocaleData(localeTr,'en')
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
