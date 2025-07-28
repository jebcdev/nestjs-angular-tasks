// Importaciones de validadores de class-validator para validación de datos
import {
    IsString,
    IsEmail,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsArray,
    IsEnum,
    IsOptional,
    Matches,
} from "class-validator";
// Importaciones de transformadores de class-transformer para conversión de datos
import { Transform, Type } from "class-transformer";
// Importación del enum de roles (aunque no se usa en este DTO)
import { Roles } from "@/common/enums";

// DTO (Data Transfer Object) para el inicio de sesión de usuarios
export class AuthLoginDto {
    // Validación del campo email
    @IsEmail({}, { message: "Debe proporcionar un email válido" })
    @IsNotEmpty({ message: "El email es obligatorio" })
    @MaxLength(150, {
        message: "El email no puede exceder 150 caracteres",
    })
    // Transformación para limpiar espacios y convertir a minúsculas
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    // Validación del campo contraseña
    @IsString({
        message: "La contraseña debe ser una cadena de texto",
    })
    @MinLength(8, {
        message: "La contraseña debe tener al menos 6 caracteres",
    })
    @MaxLength(50, {
        message: "La contraseña no puede exceder 50 caracteres",
    })
    // Regex que valida formato de contraseña segura
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
            message:
                "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número o carácter especial",
        }
    )
    password: string;
}
