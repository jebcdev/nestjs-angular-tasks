# 🎯 Frontend Tasks - Sistema de Gestión de Tareas

[![Angular](https://img.shields.io/badge/Angular-20-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C.svg)](https://rxjs.dev/)

## 📋 Descripción

Frontend desarrollado en Angular 19 con arquitectura standalone components para el sistema de gestión de tareas. Implementa una interfaz moderna y responsiva con formularios reactivos, autenticación JWT, y gestión de estado basada en señales.

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── app/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── interfaces/          # Interfaces para auth (User, LoginRequest, etc.)
│   │   ├── services/            # Servicio de autenticación
│   │   ├── pages/               # Páginas de login y registro
│   │   ├── layout/              # Layout específico para auth
│   │   └── auth.routes.ts       # Rutas del módulo auth
│   │
│   ├── dashboard/               # Módulo administrativo
│   │   ├── components/          # Componentes reutilizables del dashboard
│   │   ├── guards/              # Guards de autenticación y autorización
│   │   ├── interfaces/          # Interfaces (Task, Status, TaskRequest)
│   │   ├── services/            # Servicios para API calls
│   │   ├── pages/               # Páginas del dashboard
│   │   ├── layout/              # Layout del dashboard
│   │   └── dashboard.routes.ts  # Rutas del dashboard
│   │
│   ├── tasks/                   # Módulo frontend de tareas
│   │   ├── components/          # Componentes de tareas (formularios, tablas)
│   │   ├── pages/               # Páginas para CRUD de tareas
│   │   ├── layout/              # Layout específico para usuarios
│   │   └── tasks.routes.ts      # Rutas del módulo tasks
│   │
│   ├── common/                  # Recursos compartidos
│   │   ├── components/          # Componentes reutilizables
│   │   ├── interceptors/        # Interceptores HTTP
│   │   ├── interfaces/          # Interfaces globales
│   │   └── enums/               # Enumeraciones (Roles)
│   │
│   ├── app.config.ts            # Configuración principal de la app
│   ├── app.routes.ts            # Rutas principales
│   └── app.ts                   # Componente raíz
│
├── environments/                # Variables de entorno
└── styles.css                   # Estilos globales con Tailwind
```

## 🚀 Tecnologías Utilizadas

### Core Framework

- **Angular 19**: Framework principal con standalone components
- **TypeScript 5.7**: Tipado estático y últimas features de JS
- **RxJS 7.8**: Programación reactiva y manejo de estado

### UI/UX

- **TailwindCSS 3.4**: Framework de CSS utilitario
- **Flowbite**: Componentes UI preconstruidos
- **Font Awesome 7.0**: Iconografía
- **ngx-sonner**: Sistema de notificaciones toast

### Formularios y Validación

- **Angular Reactive Forms**: Formularios reactivos con validaciones
- **Custom Validators**: Validaciones personalizadas para contraseñas

### Autenticación y Seguridad

- **JWT Tokens**: Autenticación basada en tokens
- **HTTP Interceptors**: Interceptor automático para headers de auth
- **Route Guards**: Protección de rutas por rol de usuario

### Gestión de Estado

- **Angular Signals**: Sistema de reactividad moderno
- **Computed Properties**: Propiedades derivadas reactivas
- **rxResource**: Recursos reactivos para datos asíncronos

## 🛠️ Instalación y Configuración

### Prerequisitos

- Node.js 18+ y npm/yarn
- Angular CLI 19+

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/jebcdev/nestjs-angular-tasks.git
cd nestjs-angular-tasks/frontend-tasks
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api/v1",
};
```

4. **Ejecutar en modo desarrollo**

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## 🔐 Sistema de Autenticación

### Roles de Usuario

- **Admin**: Acceso completo al dashboard y gestión de estados
- **User**: Acceso a gestión de sus propias tareas

### Flujo de Autenticación

1. Login/Registro → JWT Token
2. Token almacenado en localStorage
3. Interceptor agrega automáticamente el token a las requests
4. Guards protegen rutas según el rol

### Guards Implementados

- `IsAuthenticated`: Verifica que el usuario esté logueado
- `IsAdminGuard`: Verifica permisos de administrador

## 📊 Funcionalidades Principales

### Módulo de Autenticación (`/auth`)

- **Login**: Inicio de sesión con email/contraseña
- **Registro**: Registro de nuevos usuarios
- **Validaciones**: Formularios con validaciones robustas
- **Redirección**: Automática según el rol del usuario

### Módulo Dashboard (`/dashboard`) - Solo Admins

- **Gestión de Estados**: CRUD completo de estados de tareas
- **Gestión de Tareas**: Vista administrativa de todas las tareas
- **Gestión de Usuarios**: Vista de usuarios del sistema

### Módulo Tasks (`/tasks`) - Usuarios Autenticados

- **Mis Tareas**: Vista de tareas del usuario actual
- **CRUD de Tareas**: Crear, ver, editar y eliminar tareas propias
- **Estados Visuales**: Colores dinámicos para estados de tareas

## 🔧 Componentes Principales

### Formularios Reutilizables

```typescript
// Ejemplo de uso del formulario de tareas
<tasks-form
  [isReadonly]="false"
  [task]="currentTask"
/>
```

### Componentes de Estado de Recursos

```typescript
// Manejo de estados de carga con rxResource
@if (tasksRs.isLoading()) {
  <is-loading />
} @else if (!tasksRs.hasValue()) {
  <is-empty />
} @else if (tasksRs.error()) {
  <is-error />
} @else {
  <tasks-table [tasks]="tasksRs.value()" />
}
```

### Interceptor de Autenticación

```typescript
// Automáticamente agrega JWT a las requests
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token) {
    const newReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    return next(newReq);
  }
  return next(req);
}
```

## 🎨 Sistema de Estilos

### TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Clases Utilitarias Personalizadas

```css
.btn-primary {
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2;
}

.btn-danger {
  @apply text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-2 py-1 text-center me-2 mb-2;
}
```

## 🌐 API Integration

### Servicios Principales

#### AuthService

```typescript
// Servicio de autenticación
class AuthService {
  login(data: LoginRequest): Observable<boolean>;
  register(data: RegisterRequest): Observable<boolean>;
  checkAuthStatus(): Observable<boolean>;
  logout(): void;
  isAdmin(): boolean;
}
```

#### DashboardTasksService

```typescript
// Servicio para gestión de tareas
class DashboardTasksService {
  getTasks(): Observable<Task[]>;
  getTaskById(id: string): Observable<Task>;
  createTask(task: TaskRequest): void;
  updateTask(id: string, task: TaskRequest): void;
  removeTask(id: string): void;
}
```

### Endpoints de la API

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/check-token` - Verificar token
- `GET /tasks` - Obtener tareas
- `POST /tasks` - Crear tarea
- `PATCH /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea
- `GET /tasks-statuses` - Obtener estados
- `POST /tasks-statuses` - Crear estado (Admin)

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop**: Layout completo con navegación lateral
- **Tablet**: Layout adaptativo con menú colapsable
- **Mobile**: Navegación móvil con hamburger menu

## 🧪 Comandos de Desarrollo

```bash
# Desarrollo
ng serve                    # Servidor de desarrollo

# Construcción
ng build                    # Build de producción
ng build --configuration=development  # Build de desarrollo

# Linting
ng lint                     # Verificar código con ESLint

# Testing
ng test                     # Ejecutar tests unitarios
ng e2e                      # Tests end-to-end

# Generación de componentes
ng generate component feature/component-name --standalone
ng generate service feature/service-name
ng generate guard feature/guard-name
```

## 🔒 Seguridad

### Medidas Implementadas

- **JWT Authentication**: Tokens seguros para autenticación
- **Route Guards**: Protección de rutas sensibles
- **Input Validation**: Validaciones en frontend y backend
- **XSS Protection**: Sanitización automática de Angular
- **CORS**: Configurado en el backend

### Validaciones de Formularios

```typescript
// Ejemplo de validaciones complejas
password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]];
```

## 🚀 Despliegue

### Build de Producción

```bash
ng build --configuration=production
```

### Variables de Entorno de Producción

```typescript
// src/environments/environment.ts
export const environment = {
  production: true,
  apiUrl: "https://api.tudominio.com/api/v1",
};
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Convenciones de Código

- Seguir las guías de estilo de Angular
- Usar standalone components
- Implementar tipado estricto con TypeScript
- Comentar código complejo
- Escribir tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

**Tu Nombre** - [GitHub](https://github.com/tu-usuario)

---

### 📞 Soporte

Para soporte y preguntas:

- 📧 Email: tu-email@dominio.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/nestjs-angular-tasks/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/tu-usuario/nestjs-angular-tasks/wiki)
