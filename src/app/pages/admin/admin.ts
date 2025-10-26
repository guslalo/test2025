import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStore } from '../../core/services/local-store';
import { EditableTitle } from '../../core/models/editable-title.model';
import { FormDialog, FormDialogData } from '../../shared/components/form-dialog/form-dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog';

// Página de administración - Aquí está el CRUD completo
@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  displayedColumns: string[] = ['title', 'year', 'type', 'userNotes', 'actions'];
  dataSource: MatTableDataSource<EditableTitle>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private localStore: LocalStore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<EditableTitle>([]);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // READ - Cargar todas las películas del localStorage
  loadData(): void {
    const data = this.localStore.getWorkingData();
    this.dataSource.data = data;
  }

  // Filtrar la tabla cuando el usuario busca
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // CREATE - Abrir diálogo para crear una película nueva
  openCreateDialog(): void {
    const dialogData: FormDialogData = {
      title: 'Crear Nuevo Título',
      mode: 'create'
    };

    const dialogRef = this.dialog.open(FormDialog, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: EditableTitle) => {
      if (result) {
        // Guardar la nueva película en localStorage
        this.localStore.addToWorkingData(result);
        this.loadData();
        this.snackBar.open('Título creado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // UPDATE - Abrir diálogo para editar una película existente
  openEditDialog(title: EditableTitle): void {
    const dialogData: FormDialogData = {
      title: 'Editar Título',
      editableTitle: { ...title },
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(FormDialog, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: EditableTitle) => {
      if (result) {
        // Actualizar la película en localStorage
        this.localStore.updateInWorkingData(result.id, result);
        this.loadData();
        this.snackBar.open('Título actualizado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // DELETE - Eliminar una película
  deleteTitle(title: EditableTitle): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar "${title.title}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Borrar la película del localStorage
        this.localStore.deleteFromWorkingData(title.id);
        this.loadData();
        this.snackBar.open('Título eliminado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
