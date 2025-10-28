# Aplicación de Gestión de Películas

Aplicación web desarrollada en Angular para buscar, gestionar y guardar información de películas y series usando la API de Online Movie Database de RapidAPI.

## Contenido

- [Tecnologías Usadas](#tecnologías-usadas)
- [Por qué elegí esta API](#por-qué-elegí-esta-api)
- [Funcionalidades](#funcionalidades)
- [Instalación](#instalación)
- [Comandos Disponibles](#comandos-disponibles)

## Tecnologías Usadas

- Angular 20.1.0
- Angular Material 20.2.10
- TypeScript 5.8.2
- RxJS 7.8.0
- API: Online Movie Database de RapidAPI

## Por qué elegí esta API

**1. Datos completos y bien organizados**
La API entrega toda la información necesaria: título, año, tipo, imágenes, etc.

**2. Endpoints útiles**

- auto-complete: Para búsquedas rápidas
- title/get-overview-details: Para detalles completos

**3. Plan gratuito suficiente**
500 requests al mes gratis, suficiente para desarrollo y demostración.

**4. Datos reales de IMDb**
Información real que hace la aplicación práctica y realista.

## Funcionalidades

### Requisitos Cumplidos

- Angular Material para toda la interfaz
- Diseño responsive (móvil, tablet y escritorio)
- CRUD completo temporal con localStorage
- Validación de formularios
- API gratuita integrada

### Características

**1. Inicio**

- Búsqueda de películas en tiempo real
- Grilla adaptable de resultados
- Sistema de favoritos
- Carga automática de películas populares al iniciar

**2. Administración**

- Crear: Agregar películas manualmente
- Leer: Tabla con paginación y filtros
- Actualizar: Editar información
- Eliminar: Borrar con confirmación

**3. Detalles**

- Información completa de cada película
- Notas personalizadas
- Calificación local

**4. Favoritos**

- Marcar películas favoritas
- Persistencia en localStorage
- Vista dedicada de favoritos

**5. Reiniciar Datos**

- Botón para limpiar localStorage
- Confirmación antes de borrar

## Instalación

### Requisitos previos

- Node.js versión 18 o superior
- npm

### Pasos

**1. Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd test
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Iniciar la aplicación**

```bash
npm start
```

**4. Abrir en el navegador**

```
http://localhost:4200
```

La aplicación ya tiene configurada una API key de RapidAPI. Si quieres usar tu propia key, modifica el archivo `src/environments/environment.ts`.

## Comandos Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar tests
npm test
```

## Estructura del Proyecto

```
src/app/
├── core/                    # Servicios y modelos principales
│   ├── models/             # Modelos de datos (Title, EditableTitle)
│   ├── services/           # omdb-api.ts, local-store.ts
│   └── interceptors/       # rapidapi-headers-interceptor.ts
├── pages/                  # Páginas (home, admin, favorites, title-details)
├── shared/                 # Componentes compartidos (dialogs, layout)
└── environments/           # Configuración de API
```

## Cómo Funciona

### CRUD con localStorage

**Crear**

```typescript
addToWorkingData(title: EditableTitle): void
```

**Leer**

```typescript
getWorkingData(): EditableTitle[]
```

**Actualizar**

```typescript
updateInWorkingData(id: string, updatedTitle: EditableTitle): void
```

**Eliminar**

```typescript
deleteFromWorkingData(id: string): void
```

Los datos se guardan en localStorage bajo las claves:

- "workingData": Todas las películas
- "favorites": IDs de favoritos

### Validación de Formularios

- **Título**: Obligatorio, máximo 200 caracteres
- **Año**: Obligatorio
- **Tipo**: Obligatorio (movie, series, episode)
- **URL Imagen**: Obligatoria, formato URL válido
- **Notas**: Opcional, mínimo 5 caracteres si se llena

### Responsive Design

- **Móvil**: Menú hamburguesa, grilla 1-2 columnas
- **Tablet**: Menú lateral, grilla 3-4 columnas
- **Escritorio**: Menú fijo, grilla 5-6 columnas

### Integración con API

La aplicación usa interceptores HTTP para agregar automáticamente los headers de RapidAPI en cada petición.

**Endpoints usados:**

- `/auto-complete?q={búsqueda}` - Buscar películas
- `/title/get-overview-details?tconst={id}` - Detalles de película

Al iniciar, se cargan automáticamente películas de: Avengers, Batman, Star Wars, Harry Potter y Matrix.

## Buenas Prácticas Aplicadas

- Separación de responsabilidades (modelos, servicios, componentes)
- Tipado fuerte con TypeScript
- Manejo centralizado de errores
- Componentes reutilizables
- Código modular

## Notas

- Proyecto generado con Angular CLI 20.1.5
- Interfaz completamente responsive
