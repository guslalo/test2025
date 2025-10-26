import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Title } from '../models/title.model';
import { ApiSearchResponse } from '../models/api-response.model';

// Servicio para conectarse a la API de películas (RapidAPI - Online Movie Database)
@Injectable({
  providedIn: 'root'
})
export class OmdbApi {
  private readonly baseUrl = environment.rapidApi.baseUrl;

  constructor(private http: HttpClient) { }

  // Buscar películas por nombre
  searchTitles(query: string, page: number = 1): Observable<ApiSearchResponse<Title>> {
    const url = `${this.baseUrl}/auto-complete?q=${encodeURIComponent(query)}`;

    return this.http.get<any>(url).pipe(
      map(response => this.mapToSearchResponse(response, page)),
      catchError(this.handleError)
    );
  }

  // Cargar películas populares de diferentes categorías
  getTopRated(page: number = 1): Observable<ApiSearchResponse<Title>> {
    // Hacemos varias búsquedas de películas populares en paralelo
    const queries = ['Avengers', 'Batman', 'Star Wars', 'Harry Potter', 'Matrix'];

    const requests = queries.map(query =>
      this.http.get<any>(`${this.baseUrl}/auto-complete?q=${encodeURIComponent(query)}`).pipe(
        catchError(() => throwError(() => new Error('Error en búsqueda')))
      )
    );

    return forkJoin(requests).pipe(
      map(responses => {
        // Combinar todas las respuestas en un solo array
        let allItems: Title[] = [];
        responses.forEach(response => {
          if (response?.d) {
            const items = response.d.map((item: any) => this.mapToTitle(item));
            allItems = [...allItems, ...items];
          }
        });

        // Quitar duplicados por ID
        const uniqueItems = allItems.filter((item, index, self) =>
          index === self.findIndex(t => t.id === item.id)
        );

        return {
          items: uniqueItems.slice(0, 40), // Limitar a 40 películas
          total: uniqueItems.length,
          page,
          pageSize: 40
        };
      }),
      catchError(this.handleError)
    );
  }

  // Obtener los detalles de una película específica
  getTitleDetails(id: string): Observable<Title> {
    const url = `${this.baseUrl}/title/get-overview-details?tconst=${id}&currentCountry=US`;

    return this.http.get<any>(url).pipe(
      map(response => this.mapToTitle(response, id)),
      catchError(this.handleError)
    );
  }

  // Convertir la respuesta de la API a nuestro formato
  private mapToSearchResponse(response: any, page: number): ApiSearchResponse<Title> {
    let items: Title[] = [];

    // La API puede devolver la data en diferentes formatos, así que los manejamos todos
    if (response?.d) {
      items = response.d.map((item: any) => this.mapToTitle(item));
    } else if (response?.results) {
      items = response.results.map((item: any) => this.mapToTitle(item));
    } else if (Array.isArray(response)) {
      items = response.map((item: any) => this.mapToTitle(item));
    }

    return {
      items: items.slice(0, 20), // Máximo 20 resultados
      total: items.length,
      page,
      pageSize: 20
    };
  }

  private mapToTitle(data: any, fallbackId?: string): Title {
    return {
      id: data.id || data.tconst || fallbackId || `temp-${Date.now()}`,
      title: data.l || data.title?.title || data.title || data.titleText?.text || 'Sin título',
      year: data.y || data.year || data.releaseYear?.year || data.title?.year || undefined,
      imageUrl: data.i?.imageUrl || data.image?.url || data.title?.image?.url || undefined,
      type: this.mapTitleType(data.q || data.titleType || data.title?.titleType)
    };
  }

  private mapTitleType(type: string): 'movie' | 'series' | 'episode' | undefined {
    if (!type) return undefined;

    const lowerType = type.toLowerCase();
    if (lowerType.includes('movie')) return 'movie';
    if (lowerType.includes('series') || lowerType.includes('tv')) return 'series';
    if (lowerType.includes('episode')) return 'episode';

    return undefined;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error al consultar la API';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'Error de autenticación. Verifica tu API key.';
      } else if (error.status === 429) {
        errorMessage = 'Límite de requests excedido. Intenta más tarde.';
      } else {
        errorMessage = `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error de API OMDB:', error);
    return throwError(() => new Error(errorMessage));
  }
}
