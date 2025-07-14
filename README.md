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
- POST /api/chicos/:dni/assign-micro - Asignar estudiante a micro
- DELETE /api/chicos/:dni/micro - Remover estudiante del micro

### Micros
- GET /api/micros - Obtener todos los micros
- GET /api/micros/:patente - Obtener micro por patente
- POST /api/micros - Crear nuevo micro
- PUT /api/micros/:patente - Actualizar micro
- DELETE /api/micros/:patente - Eliminar micro
- POST /api/micros/:patente/assign-chofer - Asignar chofer a micro
- DELETE /api/micros/:patente/chofer - Remover chofer del micro
- GET /api/micros/:patente/chicos - Obtener estudiantes del micro

### Choferes
- GET /api/choferes - Obtener todos los choferes
- GET /api/choferes/:dni - Obtener chofer por DNI
- POST /api/choferes - Crear nuevo chofer
- PUT /api/choferes/:dni - Actualizar chofer
- DELETE /api/choferes/:dni - Eliminar chofer

## Características de la Interfaz

### Gestión de Estudiantes
- Formularios reactivos con validaciones
- Tabla interactiva con ordenamiento
- Búsqueda y filtrado en tiempo real
- Asignación visual a micros
- Validación de edad escolar (3-18 años)

### Gestión de Micros
- Interfaz intuitiva para capacidad
- Visualización de ocupación en tiempo real
- Asignación de choferes certificados
- Control de capacidad máxima

### Gestión de Choferes
- Validación de licencias de conducir
- Panel de disponibilidad
- Gestión de asignaciones a micros

## Tecnologías Utilizadas

### Frontend
- Angular 19 con TypeScript
- Angular Material Design System
- RxJS para programación reactiva
- Formularios reactivos con validaciones
- Jasmine y Karma para testing (85%+ coverage)

### Backend
- Node.js con TypeScript
- Express.js framework
- MongoDB con Mongoose ODM
- Express Validator para validaciones
- Jest para testing unitario

### Infraestructura
- Docker & Docker Compose
- MongoDB en contenedor



## Instalación y Ejecución

### Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/LucasHernandoGaztanaga/school-bus-management-system.git
cd school-bus-management-system

# Levantar los servicios
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:4200
# Backend API: http://localhost:3000/api
```

### Desarrollo Local

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
ng serve
```

#### Base de datos
```bash
# Levantar solo MongoDB
docker run -d -p 27017:27017 --name mongo-school-bus mongo:7.0
```

## Testing

### Frontend
```bash
cd frontend
ng test --code-coverage --watch=false
```

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

## Validaciones de Negocio

- **Estudiantes**: Edad entre 3 y 18 años, DNI único
- **Micros**: Capacidad entre 10 y 50 estudiantes, patente única
- **Choferes**: Licencia válida, DNI único
- **Relaciones**: Un chofer por micro, estudiantes limitados por capacidad

## Acceso

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## Colaboradores

Este proyecto fue desarrollado simulando un equipo colaborativo:

- **Lucas Hernando** - Setup inicial, configuración y coordinación
- **Backend Developer** - Desarrollo de API REST con TypeScript
- **Frontend Developer** - Desarrollo de componentes Angular con Material Design

## Funcionalidades Implementadas

- CRUD completo para Chicos, Micros y Choferes
- Gestión de relaciones entre entidades
- Validaciones de negocio en frontend y backend
- Interfaz web responsive con Material Design
- Containerización completa con Docker
- Testing unitario comprehensivo
- Documentación completa de API
