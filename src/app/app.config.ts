import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {ROUTES} from "./app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(ROUTES),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(HttpClientJsonpModule)
  ]
}
