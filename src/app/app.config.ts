import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimizes performance cycles by grouping state detection ticks
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // 💡 ROUTING PROVIDER: Evaluates browser URL routes and loads the matching components
    provideRouter(routes, withComponentInputBinding()),
    
    // 💡 HTTP PIPELINE INTERCEPTOR: Essential for monitor.service.ts to connect to C# on port 44357
    provideHttpClient()
  ]
};