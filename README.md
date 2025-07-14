# School Bus Management System

Sistema de gestión de micros escolares, alumnos y choferes desarrollado como prueba técnica.

## Descripción

Sistema completo (frontend + backend) que permite gestionar la relación entre micros escolares, los alumnos que viajan en ellos y los choferes asignados a cada micro.

## API Endpoints

### Chicos
- GET /api/chicos - Obtener todos los estudiantes
- GET /api/chicos/:dni - Obtener estudiante por DNI
- POST /api/chicos - Crear nuevo estudiante
- PUT /api/chicos/:dni - Actualizar estudiante
- DELETE /api/chicos/:dni - Eliminar estudiante

### Micros
- GET /api/micros - Obtener todos los micros
- POST /api/micros - Crear nuevo micro
- PUT /api/micros/:patente - Actualizar micro
- DELETE /api/micros/:patente - Eliminar micro

### Choferes
- GET /api/choferes - Obtener todos los choferes
- POST /api/choferes - Crear nuevo chofer
- PUT /api/choferes/:dni - Actualizar chofer
- DELETE /api/choferes/:dni - Eliminar chofer

## Tecnologías Utilizadas

### Backend
- Node.js con TypeScript
- Express.js framework
- MongoDB con Mongoose ODM
- Express Validator para validaciones
- Jest para testing unitario

### Frontend
- Angular 17+ con TypeScript
- Angular Material
- RxJS
- Angular Reactive Forms

### Infraestructura
- Docker & Docker Compose
- MongoDB en contenedor

## Estructura del Proyecto

```
school-bus-management-system/
├── backend/          # API REST en Node.js + TypeScript
├── frontend/         # Aplicación Angular
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

🚧 En desarrollo activo