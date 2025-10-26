import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStore } from '../../core/services/local-store';
import { EditableTitle } from '../../core/models/editable-title.model';

@Component({
  selector: 'app-title-details',
  standalone: false,
  templateUrl: './title-details.html',
  styleUrl: './title-details.scss',
})
export class TitleDetails implements OnInit {
  title?: EditableTitle;
  editingNotes: boolean = false;
  tempNotes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStore: LocalStore,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const titles = this.localStore.getWorkingData();
      this.title = titles.find(t => t.id === id);

      if (!this.title) {
        this.snackBar.open('Título no encontrado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/']);
      }
    }
  }

  toggleFavorite(): void {
    if (this.title) {
      const isFav = this.localStore.toggleFavorite(this.title.id);
      this.snackBar.open(isFav ? 'Agregado a favoritos' : 'Eliminado de favoritos', 'Cerrar', { duration: 2000 });
    }
  }

  isFavorite(): boolean {
    return this.title ? this.localStore.isFavorite(this.title.id) : false;
  }

  startEditingNotes(): void {
    this.tempNotes = this.title?.userNotes || '';
    this.editingNotes = true;
  }

  saveNotes(): void {
    if (this.title) {
      this.title.userNotes = this.tempNotes;
      this.localStore.updateInWorkingData(this.title.id, this.title);
      this.editingNotes = false;
      this.snackBar.open('Notas guardadas', 'Cerrar', { duration: 2000 });
    }
  }

  cancelEdit(): void {
    this.editingNotes = false;
    this.tempNotes = '';
  }
}
