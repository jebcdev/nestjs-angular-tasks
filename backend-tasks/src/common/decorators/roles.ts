// Importación de SetMetadata para crear decoradores personalizados
import { SetMetadata } from "@nestjs/common";
// Importación del enum de roles
import { Roles } from "@/common/enums";

// Clave constante para identificar los metadatos de roles
export const ROLES_KEY = "roles";

// Decorador personalizado para requerir roles específicos en rutas
// Recibe una lista variable de roles y los almacena como metadatos
export const RequireRoles = (...roles: Roles[]) =>
    SetMetadata(ROLES_KEY, roles);
