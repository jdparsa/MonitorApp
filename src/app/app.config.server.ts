import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// 💡 SERVER-SIDE CONFIGURATION MATRIX
const serverConfig: ApplicationConfig = {
  providers: [
    // Registers the rendering engine engines required to pre-compile your UI components on the server
    provideServerRendering()
  ]
};

/**
 * 💡 CONFIGURATION MERGE:
 * Combines your core browser configuration (routing, HTTP client, etc.) from app.config.ts
 * with the server-specific rendering services defined above.
 */
export const imgConfigServer = mergeApplicationConfig(appConfig, serverConfig);