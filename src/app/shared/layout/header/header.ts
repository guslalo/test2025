import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStore } from '../../../core/services/local-store';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private localStore: LocalStore,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  // Reiniciar todos los datos de la aplicación
  resetData(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Reiniciar Datos',
        message: '¿Estás seguro de que deseas reiniciar todos los datos? Esto eliminará todas las películas, favoritos y notas guardadas.',
        confirmText: 'Reiniciar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Limpiar todo el localStorage
        localStorage.clear();
        this.snackBar.open('Datos reiniciados correctamente', 'Cerrar', { duration: 3000 });
        // Recargar la página para empezar de cero
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    });
  }
}
