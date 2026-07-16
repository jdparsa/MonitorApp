import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),     // 💡 Binds your updated routes array config
    provideHttpClient()        // 💡 Vital configuration hook for monitor.service.ts
  ]
}).catch(err => console.error(err));