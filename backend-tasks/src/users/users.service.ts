// Importación del decorador Injectable de NestJS
import { Injectable } from "@nestjs/common";
// Importación de DTOs para crear y actualizar usuarios
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// Decorador que marca la clase como un servicio inyectable
@Injectable()
export class UsersService {
    // Método para crear un nuevo usuario (implementación pendiente)
    create(createUserDto: CreateUserDto) {
        // TODO: Implementar lógica real de creación de usuario
        return "This action adds a new user";
    }

    // Método para obtener todos los usuarios (implementación pendiente)
    findAll() {
        // TODO: Implementar lógica real de búsqueda de todos los usuarios
        return `This action returns all users`;
    }

    // Método para obtener un usuario específico por ID (implementación pendiente)
    findOne(id: number) {
        // TODO: Implementar lógica real de búsqueda de usuario por ID
        return `This action returns a #${id} user`;
    }

    // Método para actualizar un usuario existente (implementación pendiente)
    update(id: number, updateUserDto: UpdateUserDto) {
        // TODO: Implementar lógica real de actualización de usuario
        return `This action updates a #${id} user`;
    }

    // Método para eliminar un usuario (implementación pendiente)
    remove(id: number) {
        // TODO: Implementar lógica real de eliminación de usuario
        return `This action removes a #${id} user`;
    }
}
