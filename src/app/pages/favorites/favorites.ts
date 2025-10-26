import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStore } from '../../core/services/local-store';
import { EditableTitle } from '../../core/models/editable-title.model';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  favorites: EditableTitle[] = [];

  constructor(
    private localStore: LocalStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const favoriteIds = this.localStore.getFavorites();
    const allTitles = this.localStore.getWorkingData();

    this.favorites = allTitles.filter(title => favoriteIds.includes(title.id));
  }

  removeFavorite(title: EditableTitle): void {
    this.localStore.removeFromFavorites(title.id);
    this.loadFavorites();
  }

  viewDetails(title: EditableTitle): void {
    this.router.navigate(['/title', title.id]);
  }
}
