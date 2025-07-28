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
// Importación del enum de roles desde el módulo común
import { Roles } from "@/common/enums";

// DTO (Data Transfer Object) para crear nuevos usuarios
export class CreateUserDto {
    // Validación del campo nombre
    @IsString({ message: "El nombre debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    @MinLength(2, {
        message: "El nombre debe tener al menos 2 caracteres",
    })
    @MaxLength(100, {
        message: "El nombre no puede exceder 100 caracteres",
    })
    @Transform(({ value }) => value?.trim())
    name: string;

    @IsEmail({}, { message: "Debe proporcionar un email válido" })
    @IsNotEmpty({ message: "El email es obligatorio" })
    @MaxLength(150, {
        message: "El email no puede exceder 150 caracteres",
    })
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsString({
        message: "La contraseña debe ser una cadena de texto",
    })
    @MinLength(8, {
        message: "La contraseña debe tener al menos 6 caracteres",
    })
    @MaxLength(50, {
        message: "La contraseña no puede exceder 50 caracteres",
    })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
            message:
                "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número o carácter especial",
        }
    )
    password: string;

    @IsOptional()
    @IsArray({ message: "Los roles deben ser un array" })
    @IsEnum(Roles, {
        each: true,
        message: `Los roles deben ser uno de los siguientes valores: ${Object.values(
            Roles
        ).join(", ")}`,
    })
    @Transform(({ value }) => {
        if (!value) return [Roles.user];
        if (Array.isArray(value)) {
            return value.map((role) =>
                role?.toString().toLowerCase()
            );
        }
        return [value?.toString().toLowerCase()];
    })
    // Tipo de transformación para asegurar que sean strings
    @Type(() => String)
    roles?: Roles[]; // Campo opcional de array de roles
}
