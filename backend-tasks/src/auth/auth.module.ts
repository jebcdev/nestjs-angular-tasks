// Importación del decorador Module de NestJS para definir módulos
import { Module } from "@nestjs/common";
// Importación de TypeORM para conectar entidades a la base de datos
import { TypeOrmModule } from "@nestjs/typeorm";
// Importación de Passport para estrategias de autenticación
import { PassportModule } from "@nestjs/passport";
// Importación del módulo JWT para manejo de tokens
import { JwtModule } from "@nestjs/jwt";
// Importación de la entidad User para trabajar con usuarios
import { User } from "@/users/entities/user.entity";
// Importación del controlador de autenticación
import { AuthController } from "./auth.controller";
// Importación del servicio de autenticación con la lógica de negocio
import { AuthService } from "./auth.service";
// Importación de la estrategia JWT personalizada
import { JwtStrategy } from "./strategies";
// Importación de la constante del secreto JWT
import { JWT_SECRET } from "./constants/jwt.constants";

// Decorador que define el módulo de autenticación
@Module({
    // Controladores que maneja este módulo
    controllers: [AuthController],
    // Servicios y estrategias que este módulo exporta para uso en otros módulos
    exports: [JwtStrategy, PassportModule, JwtModule],
    // Módulos importados que este módulo necesita
    imports: [
        // Configuración de Passport con JWT como estrategia por defecto
        PassportModule.register({ defaultStrategy: "jwt" }),
        // Configuración del módulo JWT con secreto y tiempo de expiración
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: "1d" }, // Token válido por 1 día
        }),
        // Registro de la entidad User para poder usarla en repositorios
        TypeOrmModule.forFeature([User]),
    ],
    // Servicios que proporciona este módulo
    providers: [AuthService, JwtStrategy],
})
// Clase que representa el módulo de autenticación
export class AuthModule {}
