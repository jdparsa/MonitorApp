import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { imgConfigServer } from './app/app.config.server'; // 💡 Matches the exported config name from your app.config.server.ts

/**
 * 💡 SERVER-SIDE BOOTSTRAP FUNCTION
 * This function is used by the server hosting environment to pre-compile 
 * your Angular application's UI shell directly into HTML string sets.
 */
const bootstrap = () => bootstrapApplication(AppComponent, imgConfigServer);

export default bootstrap;