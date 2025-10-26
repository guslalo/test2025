import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const rapidapiHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  // Añadir headers de RapidAPI a todas las peticiones que vayan a la API
  if (req.url.includes(environment.rapidApi.host)) {
    const clonedRequest = req.clone({
      setHeaders: {
        'x-rapidapi-key': environment.rapidApi.key,
        'x-rapidapi-host': environment.rapidApi.host
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
