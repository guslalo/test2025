import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OmdbApi } from '../../core/services/omdb-api';
import { LocalStore } from '../../core/services/local-store';
import { EditableTitle } from '../../core/models/editable-title.model';

// Componente principal - Página de inicio con búsqueda de películas
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  titles: EditableTitle[] = [];
  filteredTitles: EditableTitle[] = [];
  searchQuery: string = '';
  loading: boolean = false;

  constructor(
    private omdbApi: OmdbApi,
    private localStore: LocalStore,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Cargar lo que tengamos guardado en localStorage
    this.titles = this.localStore.getWorkingData();
    this.filteredTitles = [...this.titles];

    // Si no hay películas guardadas, cargar algunas por defecto
    if (this.titles.length === 0) {
      this.loadTitles();
    }
  }

  loadTitles(): void {
    this.loading = true;

    this.omdbApi.getTopRated().subscribe({
      next: (response) => {
        this.localStore.resetWorkingDataWith(response.items);
        this.titles = this.localStore.getWorkingData();
        this.filteredTitles = [...this.titles];
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Error al cargar datos', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
        this.titles = this.localStore.getWorkingData();
        this.filteredTitles = [...this.titles];
      }
    });
  }

  // Buscar películas cuando el usuario escribe y presiona Enter o hace clic en Buscar
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredTitles = [...this.titles];
      return;
    }

    this.loading = true;
    this.omdbApi.searchTitles(this.searchQuery).subscribe({
      next: (response) => {
        this.filteredTitles = response.items.map(item => ({
          ...item,
          userNotes: undefined,
          localRating: undefined
        }));
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Error en la búsqueda', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  // Marcar o desmarcar como favorito
  toggleFavorite(title: EditableTitle): void {
    // Primero nos aseguramos de que la película esté guardada en localStorage
    const workingData = this.localStore.getWorkingData();
    const existsInWorkingData = workingData.some(t => t.id === title.id);

    if (!existsInWorkingData) {
      this.localStore.addToWorkingData(title);
    }

    // Ahora sí la marcamos/desmarcamos como favorita
    const isFavorite = this.localStore.toggleFavorite(title.id);
    const message = isFavorite ? 'Agregado a favoritos' : 'Eliminado de favoritos';
    this.snackBar.open(message, 'Cerrar', { duration: 2000 });
  }

  isFavorite(id: string): boolean {
    return this.localStore.isFavorite(id);
  }

  viewDetails(title: EditableTitle): void {
    this.router.navigate(['/title', title.id]);
  }
}
