// Importaciones necesarias de NestJS para crear un guard
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
// Importación del enum de roles
import { Roles } from "@/common/enums";
// Importación de la entidad User para tipar el usuario
import { User } from "@/users/entities/user.entity";

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
// Guard personalizado para verificar permisos de administrador
export class AdminGuard implements CanActivate {
    // Método que determina si la request puede continuar
    canActivate(context: ExecutionContext): boolean {
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

        // Verifica si el usuario tiene el rol de administrador
        const isAdmin = user.roles.includes(Roles.admin);

        // Si no es administrador, rechaza el acceso
        if (!isAdmin) {
            throw new ForbiddenException(
                "Necesitas ser administrador para acceder a este recurso"
            );
        }

        // Permite el acceso si es administrador
        return true;
    }
}
