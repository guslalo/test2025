import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

// Bootstrap de la aplicación usando el módulo principal
platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
