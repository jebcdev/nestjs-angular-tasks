// Importaciones de decoradores y utilidades de NestJS
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Headers,
    Request,
} from "@nestjs/common";
// Importación del servicio de autenticación
import { AuthService } from "./auth.service";
// Importación de los DTOs para login y registro
import { AuthLoginDto, AuthRegisterDto } from "./dto";
// Importación del guard de autenticación de Passport
import { AuthGuard } from "@nestjs/passport";
// Importación de tipos para headers HTTP
import { IncomingHttpHeaders } from "http";
// Importación de la entidad User
import { User } from "@/users/entities/user.entity";

// Decorador que define el controlador con prefijo 'auth'
@Controller("auth")
export class AuthController {
    // Inyección del servicio de autenticación mediante constructor
    constructor(private readonly authService: AuthService) {}

    // Endpoint POST para registrar un nuevo usuario
    @Post("register")
    async registerUser(@Body() authRegisterDto: AuthRegisterDto) {
        // Delega la lógica de registro al servicio
        return await this.authService.registerUser(authRegisterDto);
    }

    // Endpoint POST para iniciar sesión
    @Post("login")
    async login(@Body() authLoginDto: AuthLoginDto) {
        // Delega la lógica de login al servicio
        return await this.authService.loginUser(authLoginDto);
    }

    // Endpoint POST para verificar si un token JWT es válido
    @Post("check-token")
    @UseGuards(AuthGuard("jwt")) // Protege la ruta con autenticación JWT
    async checkToken(@Request() req: any) {
        // Extrae el usuario autenticado de la request
        const user = req.user;
        // Extrae el token del header Authorization
        const token = req.headers.authorization.split(" ")[1];
        // Delega la verificación del token al servicio
        return await this.authService.checkToken(user, token);
    }
}
