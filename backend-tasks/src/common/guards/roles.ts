// Importaciones necesarias de NestJS para crear un guard
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
// Reflector para acceder a metadatos de decoradores
import { Reflector } from "@nestjs/core";
// Importación del enum de roles
import { Roles } from "@/common/enums";
// Importación de la entidad User para tipar el usuario
import { User } from "@/users/entities/user.entity";

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
// Guard personalizado para verificar roles específicos requeridos
export class RolesGuard implements CanActivate {
    // Constructor que inyecta el Reflector para acceder a metadatos
    constructor(private reflector: Reflector) {}

    // Método que determina si la request puede continuar
    canActivate(context: ExecutionContext): boolean {
        // Obtiene los roles requeridos desde los metadatos del handler y la clase
        const requiredRoles = this.reflector.getAllAndOverride<
            Roles[]
        >("roles", [
            context.getHandler(), // Metadatos del método
            context.getClass(), // Metadatos de la clase
        ]);

        // Si no hay roles requeridos, permite el acceso
        if (!requiredRoles) {
            return true;
        }

        // Obtiene la request HTTP del contexto de ejecución
        const request = context.switchToHttp().getRequest();
        // Extrae el usuario de la request (colocado por el JWT guard)
        const user: User = request.user;

        // Verifica si el usuario existe en la request
        if (!user) {
            throw new ForbiddenException("Usuario no autenticado");
        }

        // Verifica si el usuario tiene roles asignados
        if (!user.roles || user.roles.length === 0) {
            throw new ForbiddenException(
                "Usuario sin roles asignados"
            );
        }

        // Verifica si el usuario tiene al menos uno de los roles requeridos
        const hasRole = requiredRoles.some((role) =>
            user.roles.includes(role)
        );

        // Si no tiene ningún rol requerido, rechaza el acceso
        if (!hasRole) {
            throw new ForbiddenException(
                "No tienes permisos para acceder a este recurso"
            );
        }

        // Permite el acceso si tiene el rol requerido
        return true;
    }
}
