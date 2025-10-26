import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Module
import { MaterialModule } from './material.module';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Sidebar } from './layout/sidebar/sidebar';
import { MainLayout } from './layout/main-layout/main-layout';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { FormDialog } from './components/form-dialog/form-dialog';

@NgModule({
  declarations: [
    // Agregar aquí componentes, directivas y pipes compartidos
  
    Header,
    Footer,
    Sidebar,
    MainLayout,
    ConfirmDialog,
    FormDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    // Re-exportar módulos comunes
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    // Exportar componentes de layout
    Header,
    Footer,
    Sidebar,
    MainLayout
  ]
})
export class SharedModule { }
