import { Injectable } from '@angular/core';
import { EditableTitle } from '../models/editable-title.model';
import { Title } from '../models/title.model';

// Servicio para manejar el almacenamiento local de películas y favoritos
@Injectable({
  providedIn: 'root'
})
export class LocalStore {
  // Nombres de las keys donde guardamos la info en el localStorage
  private readonly WORKING_DATA_KEY = 'workingData';
  private readonly FAVORITES_KEY = 'favorites';

  constructor() { }

  // Función para leer cualquier cosa del localStorage
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`Error al leer ${key} del localStorage:`, error);
      return fallback;
    }
  }

  // Función para guardar cualquier cosa en el localStorage
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error al eliminar ${key} de localStorage:`, error);
    }
  }

  // --- CRUD de películas (workingData) ---

  // Traer todas las películas guardadas
  getWorkingData(): EditableTitle[] {
    return this.get<EditableTitle[]>(this.WORKING_DATA_KEY, []);
  }

  setWorkingData(data: EditableTitle[]): void {
    this.set(this.WORKING_DATA_KEY, data);
  }

  // Cuando traemos datos nuevos de la API, reemplazamos todo
  resetWorkingDataWith(apiData: Title[]): void {
    const editableData: EditableTitle[] = apiData.map(title => ({
      ...title,
      userNotes: undefined,
      localRating: undefined
    }));
    this.setWorkingData(editableData);
  }

  // Agregar una película nueva (CREATE)
  addToWorkingData(title: EditableTitle): void {
    const data = this.getWorkingData();
    data.push(title);
    this.setWorkingData(data);
  }

  // Actualizar una película existente (UPDATE)
  updateInWorkingData(id: string, updatedTitle: EditableTitle): void {
    const data = this.getWorkingData();
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
      data[index] = updatedTitle;
      this.setWorkingData(data);
    }
  }

  // Eliminar una película (DELETE)
  deleteFromWorkingData(id: string): void {
    const data = this.getWorkingData();
    const filtered = data.filter(t => t.id !== id);
    this.setWorkingData(filtered);
  }

  // --- Manejo de favoritos ---

  // Traer la lista de IDs de favoritos
  getFavorites(): string[] {
    return this.get<string[]>(this.FAVORITES_KEY, []);
  }

  // Agregar a favoritos
  addToFavorites(id: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      this.set(this.FAVORITES_KEY, favorites);
    }
  }

  // Quitar de favoritos
  removeFromFavorites(id: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(fav => fav !== id);
    this.set(this.FAVORITES_KEY, filtered);
  }

  // Verificar si una película es favorita
  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  }

  // Cambiar el estado de favorito (si está, lo quita; si no está, lo agrega)
  toggleFavorite(id: string): boolean {
    if (this.isFavorite(id)) {
      this.removeFromFavorites(id);
      return false;
    } else {
      this.addToFavorites(id);
      return true;
    }
  }
}
