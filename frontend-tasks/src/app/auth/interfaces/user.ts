// Importación del enum de roles desde los enums comunes de la aplicación
import { Roles } from '@/common/enums'; // Enum que define los diferentes roles de usuario (admin, user, etc.)

// Interfaz que define la estructura de datos de un usuario en el sistema
export interface User {
  id: string; // Identificador único del usuario (UUID generado por el backend)
  name: string; // Nombre completo del usuario para mostrar en la interfaz
  email: string; // Dirección de correo electrónico única del usuario para autenticación
  password: string; // Contraseña del usuario (debe estar encriptada con bcrypt en el backend)
  roles: Roles[]; // Array de roles asignados al usuario que determinan sus permisos
  token?: string; // Token JWT opcional para mantener la sesión autenticada
  createdAt?: Date; // Fecha opcional de cuando se registró el usuario en el sistema
  updatedAt?: Date; // Fecha opcional de la última modificación de los datos del usuario
  deletedAt?: null; // Fecha opcional para implementar eliminación suave (null si el usuario está activo)
}
