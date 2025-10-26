import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditableTitle } from '../../../core/models/editable-title.model';

export interface FormDialogData {
  title: string;
  editableTitle?: EditableTitle;
  mode: 'create' | 'edit';
}

// Diálogo del formulario para crear/editar películas
@Component({
  selector: 'app-form-dialog',
  standalone: false,
  templateUrl: './form-dialog.html',
  styleUrl: './form-dialog.scss',
})
export class FormDialog implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  ngOnInit(): void {
    // Crear el formulario con todas las validaciones
    this.form = this.fb.group({
      title: [
        this.data.editableTitle?.title || '',
        [Validators.required, Validators.maxLength(200)] // Campo obligatorio
      ],
      year: [
        this.data.editableTitle?.year || null,
        [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)] // Obligatorio y solo años válidos (1900-2099)
      ],
      type: [
        this.data.editableTitle?.type || 'movie',
        [Validators.required] // Obligatorio
      ],
      imageUrl: [
        this.data.editableTitle?.imageUrl || '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)] // Obligatorio y debe ser URL válida
      ],
      userNotes: [
        this.data.editableTitle?.userNotes || '',
        [Validators.minLength(5), Validators.maxLength(500)] // Mínimo 5 caracteres, máximo 500
      ]
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    if (this.form.valid) {
      const result: EditableTitle = {
        id: this.data.editableTitle?.id || `local-${Date.now()}`,
        ...this.form.value
      };
      this.dialogRef.close(result);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['maxLength']) return `Máximo ${control.errors['maxLength'].requiredLength} caracteres`;
    if (control.errors['minLength']) return `Mínimo ${control.errors['minLength'].requiredLength} caracteres`;
    if (control.errors['pattern']) {
      if (field === 'year') return 'Debe ser un año válido (ej: 2024)';
      if (field === 'imageUrl') return 'Debe ser una URL válida (http:// o https://)';
      return 'Formato inválido';
    }
    if (control.errors['min']) return `Mínimo ${control.errors['min'].min}`;
    if (control.errors['max']) return `Máximo ${control.errors['max'].max}`;

    return '';
  }
}
