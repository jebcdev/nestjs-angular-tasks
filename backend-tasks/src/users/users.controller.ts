// Importaciones de decoradores y utilidades de NestJS
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from "@nestjs/common";
// Importación del servicio de usuarios
import { UsersService } from "./users.service";
// Importación de DTOs para crear y actualizar usuarios
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// Decorador que define el controlador con prefijo 'users'
@Controller("users")
export class UsersController {
    // Inyección del servicio de usuarios mediante constructor
    constructor(private readonly usersService: UsersService) {}

    // Endpoint POST para crear un nuevo usuario
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        // Delega la creación del usuario al servicio
        return this.usersService.create(createUserDto);
    }

    // Endpoint GET para obtener todos los usuarios
    @Get()
    findAll() {
        // Delega la búsqueda de usuarios al servicio
        return this.usersService.findAll();
    }

    // Endpoint GET para obtener un usuario específico por ID
    @Get(":id")
    findOne(@Param("id") id: string) {
        // Convierte el ID string a number y delega al servicio
        return this.usersService.findOne(+id);
    }

    // Endpoint PATCH para actualizar un usuario existente
    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        // Convierte el ID string a number y delega la actualización al servicio
        return this.usersService.update(+id, updateUserDto);
    }

    // Endpoint DELETE para eliminar un usuario
    @Delete(":id")
    remove(@Param("id") id: string) {
        // Convierte el ID string a number y delega la eliminación al servicio
        return this.usersService.remove(+id);
    }
}
