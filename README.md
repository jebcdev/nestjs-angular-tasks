# 🚀 NestJS + Angular Tasks

Sistema completo de gestión de tareas construido con NestJS (backend) y Angular (frontend). Incluye autenticación JWT, roles de usuario, y gestión completa de tareas.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=flat&logo=postgresql&logoColor=white)

## ✨ Características

-   🔐 **Autenticación JWT** con roles (admin/user)
-   📋 **CRUD de tareas** con estados personalizables
-   👥 **Gestión de usuarios** con permisos diferenciados
-   🎨 **UI moderna** con TailwindCSS
-   🛡️ **Seguridad robusta** con validaciones y guards
-   📱 **Responsive design** para todos los dispositivos

## 🏗️ Arquitectura

```
nestjs-angular-tasks/
├── backend-tasks/          # API REST con NestJS
│   ├── src/
│   │   ├── auth/          # Autenticación JWT
│   │   ├── tasks/         # Gestión de tareas
│   │   ├── users/         # Gestión de usuarios
│   │   └── tasks-statuses/ # Estados de tareas
│   └── ...
├── frontend-tasks/         # SPA con Angular
│   ├── src/app/
│   │   ├── auth/          # Login/Registro
│   │   ├── dashboard/     # Panel admin
│   │   ├── tasks/         # Gestión de tareas
│   │   └── common/        # Componentes compartidos
│   └── ...
└── README.md              # Este archivo
```

## 🛠️ Tecnologías

### Backend

-   **NestJS 10** - Framework Node.js
-   **TypeScript** - Lenguaje tipado
-   **PostgreSQL** - Base de datos
-   **TypeORM** - ORM para base de datos
-   **JWT** - Autenticación
-   **bcryptjs** - Hash de contraseñas

### Frontend

-   **Angular 19** - Framework frontend
-   **TypeScript 5.7** - Tipado estático
-   **TailwindCSS** - Estilos utilitarios
-   **RxJS** - Programación reactiva
-   **Angular Signals** - Gestión de estado

## 🚀 Instalación Rápida

### Prerrequisitos

-   Node.js 18+
-   PostgreSQL 14+
-   Git

### 1. Clonar el proyecto

```bash
git clone https://github.com/jebcdev/nestjs-angular-tasks.git
cd nestjs-angular-tasks
```

### 2. Configurar Backend

```bash
cd backend-tasks
npm install

# Crear archivo .env
echo "PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nest-angular-tasks
JWT_SECRET=tu_jwt_secret_aqui" > .env

# Ejecutar
npm run start:dev
```

### 3. Configurar Frontend

```bash
cd ../frontend-tasks
npm install

# Ejecutar
ng serve
```

### 4. Acceder a la aplicación

-   **Frontend**: http://localhost:4200
-   **Backend API**: http://localhost:3000/api/v1

## 📊 Funcionalidades por Rol

### 👤 Usuario Regular

-   ✅ Registrarse e iniciar sesión
-   ✅ Ver, crear, editar y eliminar sus tareas
-   ✅ Cambiar estados de sus tareas
-   ✅ Ver todos los estados disponibles

### 👑 Administrador

-   ✅ Todo lo que puede hacer un usuario regular
-   ✅ Ver todas las tareas del sistema
-   ✅ Gestionar usuarios
-   ✅ Crear, editar y eliminar estados de tareas

## 🔧 Configuración de Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE "nest-angular-tasks";

-- Crear usuario (opcional)
CREATE USER nest_user WITH PASSWORD 'nest_password';
GRANT ALL PRIVILEGES ON DATABASE "nest-angular-tasks" TO nest_user;
```

## 📚 Documentación Detallada

Para información más detallada:

-   📖 [Backend README](./backend-tasks/README.md) - Documentación completa del API
-   📖 [Frontend README](./frontend-tasks/README.md) - Documentación de la interfaz

## 🧪 Testing

```bash
# Backend
cd backend-tasks
npm run test

# Frontend
cd frontend-tasks
ng test
```

## 🚀 Producción

### Build

```bash
# Backend
cd backend-tasks
npm run build
npm run start:prod

# Frontend
cd frontend-tasks
ng build --configuration=production
```

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3000
DB_HOST=tu_host_db
JWT_SECRET=jwt_secret_muy_seguro
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ usando NestJS y Angular**
