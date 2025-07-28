// Importaciones de excepciones y decoradores de NestJS
import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
// Servicio para manejo de tokens JWT
import { JwtService } from "@nestjs/jwt";
// Decorador para inyectar repositorios de TypeORM
import { InjectRepository } from "@nestjs/typeorm";
// Clase Repository de TypeORM para operaciones de base de datos
import { Repository } from "typeorm";
// Importación de DTOs para autenticación
import { AuthLoginDto, AuthRegisterDto } from "./dto";
// Interfaz para el payload del JWT
import { IJwtPayload } from "./interfaces";
// Utilidades para bcrypt y manejo de errores
import { BcryptUtil, handleErrors } from "@/common/utils";
// Entidad User para trabajar con usuarios
import { User } from "@/users/entities/user.entity";
// Tipos para headers HTTP
import { IncomingHttpHeaders } from "http";

// Decorador que marca la clase como un servicio inyectable
@Injectable()
export class AuthService {
    // Constructor con inyección de dependencias
    constructor(
        // Inyección del repositorio de User para operaciones de base de datos
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        // Inyección del servicio JWT para generar y verificar tokens
        @Inject()
        private readonly jwtService: JwtService
    ) {}

    // Método privado para generar tokens JWT
    private getJwtToken(payload: IJwtPayload) {
        // Genera y firma un token JWT con el payload proporcionado
        const token = this.jwtService.sign(payload);

        return token;
    }

    // Método para registrar un nuevo usuario
    async registerUser(
        authRegisterDto: AuthRegisterDto
    ): Promise<User | undefined> {
        try {
            // Verificar si el email ya existe antes de intentar crear el usuario
            const existingUser = await this.userRepository.findOne({
                where: { email: authRegisterDto.email },
            });

            // Si el usuario ya existe, lanzar excepción
            if (existingUser) {
                throw new BadRequestException(
                    "El email ya está en uso"
                );
            }

            // Hashear la contraseña antes de guardarla
            authRegisterDto.password = await BcryptUtil.HashPassword(
                authRegisterDto.password
            );

            // Crear instancia del usuario con los datos del DTO
            const user = this.userRepository.create(authRegisterDto);
            if (!user)
                throw new BadRequestException("Error creating user");

            // Guardar el usuario en la base de datos
            const savedUser = await this.userRepository.save(user);
            if (!savedUser)
                throw new BadRequestException("Error saving user");

            // Crear payload para el token JWT
            const payload: IJwtPayload = {
                data: savedUser.id,
            };

            // Generar token JWT y asignarlo al usuario
            savedUser.token = this.getJwtToken(payload);
            // Eliminar la contraseña de la respuesta por seguridad
            delete savedUser.password;

            return savedUser;
        } catch (error) {
            // Manejo centralizado de errores
            handleErrors(error, "AuthService.registerUser");
        }
    }

    // Método para autenticar un usuario existente
    async loginUser(
        authLoginDto: AuthLoginDto
    ): Promise<User | undefined> {
        try {
            // Buscar usuario por email, incluyendo la contraseña en la consulta
            const existingUser = await this.userRepository.findOne({
                where: { email: authLoginDto.email },
                select: ["id", "email", "password"], // Incluir password para validación
            });

            // Si no existe el usuario, lanzar excepción de credenciales inválidas
            if (!existingUser)
                throw new UnauthorizedException(
                    "Invalid Credentials"
                );

            // Verificar que el usuario tenga contraseña
            if (!existingUser.password)
                throw new UnauthorizedException(
                    "Invalid Credentials"
                );

            // Comparar la contraseña proporcionada con la hasheada
            const isPasswordValid = await BcryptUtil.ComparePassword(
                authLoginDto.password,
                existingUser.password
            );

            // Si la contraseña no es válida, lanzar excepción
            if (!isPasswordValid)
                throw new UnauthorizedException(
                    "Invalid Credentials"
                );

            // Crear payload para el token JWT
            const payload: IJwtPayload = {
                data: existingUser.id,
            };

            // Generar token JWT
            const token = this.getJwtToken(payload);

            // Obtener datos completos del usuario sin la contraseña
            const user = await this.userRepository.findOne({
                where: { id: existingUser.id },
            });

            if (!user)
                throw new UnauthorizedException("User not found");

            // Asignar token al usuario
            user.token = token;
            // Eliminar contraseña de la respuesta
            delete user.password;

            return user;
        } catch (error) {
            // Manejo centralizado de errores
            handleErrors(error);
        }
    }

    // Método para verificar la validez de un token
    async checkToken(user: User, token: string) {
        try {
            // Asignar el token al usuario y devolverlo
            user.token = token;
            return user;
        } catch (error) {
            // Manejo centralizado de errores
            handleErrors(error);
        }
    }
}
