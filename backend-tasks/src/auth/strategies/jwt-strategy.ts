// Importación de la clase base para estrategias de Passport
import { PassportStrategy } from "@nestjs/passport";
// Importación de utilidades para extraer JWT y la estrategia JWT
import { ExtractJwt, Strategy } from "passport-jwt";
// Importación de la interfaz del payload JWT
import { IJwtPayload } from "../interfaces";
// Importación de la entidad User
import { User } from "@/users/entities/user.entity";
// Decorador para inyección de repositorios TypeORM
import { InjectRepository } from "@nestjs/typeorm";
// Clase Repository de TypeORM
import { Repository } from "typeorm";
// Importaciones de excepciones y decorador Injectable de NestJS
import { UnauthorizedException, Injectable } from "@nestjs/common";
// Importación de la constante del secreto JWT
import { JWT_SECRET } from "../constants/jwt.constants";

// Decorador que marca la clase como inyectable
@Injectable()
// Clase que extiende PassportStrategy para implementar autenticación JWT
export class JwtStrategy extends PassportStrategy(Strategy) {
    // Constructor con inyección del repositorio de usuarios
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        // Llamada al constructor padre con configuración JWT
        super({
            // Extrae el token del header Authorization como Bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // No ignora la expiración del token
            ignoreExpiration: false,
            // Clave secreta para verificar la firma del token
            secretOrKey: JWT_SECRET,
        });
    }

    // Método que valida el payload del JWT y retorna el usuario
    async validate(payload: IJwtPayload): Promise<User> {
        // Log para debugging del payload recibido
        console.log("JWT Strategy - Payload recibido:", payload);

        // Extrae el ID del usuario del payload
        const { data } = payload;
        console.log("JWT Strategy - User ID extraído:", data);

        // Busca el usuario en la base de datos usando el ID del payload
        const user = await this.userRepository.findOne({
            where: { id: data },
        });

        // Log para confirmar si se encontró el usuario
        console.log(
            "JWT Strategy - Usuario encontrado:",
            user ? "Sí" : "No"
        );

        // Si no se encuentra el usuario, lanzar excepción de no autorizado
        if (!user) {
            console.log(
                "JWT Strategy - Usuario no encontrado, lanzando excepción"
            );
            throw new UnauthorizedException("Unauthorized");
        }

        // Log de validación exitosa
        console.log("JWT Strategy - Validación exitosa");
        // Retorna el usuario que será inyectado en req.user
        return user;
    }
}
