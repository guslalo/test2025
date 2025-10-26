import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Módulos del core y shared
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { rapidapiHeadersInterceptor } from './core/interceptors/rapidapi-headers-interceptor';

// Módulo principal de la aplicación
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([rapidapiHeadersInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
