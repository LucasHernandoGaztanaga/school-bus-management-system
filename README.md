# School Bus Management System

Sistema de gestión de micros escolares, alumnos y choferes desarrollado como prueba técnica.

## Descripción

Sistema completo (frontend + backend) que permite gestionar la relación entre micros escolares, los alumnos que viajan en ellos y los choferes asignados a cada micro.

## Características de la Interfaz

### Gestión de Estudiantes
- Formularios reactivos con validaciones
- Tabla interactiva con ordenamiento
- Búsqueda y filtrado en tiempo real
- Asignación visual a micros

### Gestión de Micros
- Interfaz intuitiva para capacidad
- Visualización de ocupación
- Asignación de choferes
- Estado en tiempo real

### Gestión de Choferes
- Validación de licencias
- Panel de disponibilidad
- Historial de asignaciones

## Tecnologías Utilizadas

### Frontend
- Angular 19 con TypeScript
- Angular Material Design System
- RxJS para programación reactiva
- Formularios reactivos con validaciones
- Jasmine y Karma para testing (85%+ coverage)

### Backend
- Node.js con TypeScript
- Express.js
- MongoDB con Mongoose
- Express Validator

### Infraestructura
- Docker & Docker Compose
- MongoDB en contenedor

## Estructura del Proyecto

```
school-bus-management-system/
├── backend/          # API REST en Node.js + TypeScript
├── frontend/         # Aplicación Angular con Material Design
├── docker-compose.yml
└── README.md
```

## Instalación y Ejecución

### Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/LucasHernandoGaztanaga/school-bus-management-system.git
cd school-bus-management-system

# Levantar los servicios
docker-compose up -d
```

### Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
ng serve
```

## Testing

### Frontend
```bash
cd frontend
ng test --code-coverage
```

### Backend
```bash
cd backend
npm test
```

## Acceso

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

## Colaboradores

Este proyecto fue desarrollado simulando un equipo colaborativo:

- **Lucas Hernando** - Setup inicial y configuración
- **Backend Developer** - Desarrollo de API REST
- **Frontend Developer** - Desarrollo de componentes Angular

## Funcionalidades

- CRUD completo para Chicos, Micros y Choferes
- Gestión de relaciones entre entidades
- Validaciones de negocio
- Interfaz web responsive
- Containerización con Docker

## Estado del Proyecto

En desarrollo activo