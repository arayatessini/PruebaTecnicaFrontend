import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {

    // Permite mostrar en consola el error y categorizarlo según el tipo de error HTTP.
      console.error('HTTP Error:', error);

      if (error.status === 0) {
        console.error('Error de red o servidor caído');
      } else if (error.status === 404) {
        console.error('Recurso no encontrado');
      } else if (error.status >= 500) {
        console.error('Error del servidor');
      }

      return throwError(() => error);
    })
  );
};