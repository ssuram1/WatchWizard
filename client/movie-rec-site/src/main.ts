import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser'

platformBrowserDynamic()
  // .bootstrapModule(AppRoutingModule)
  // .catch((err) => console.error(err));
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


