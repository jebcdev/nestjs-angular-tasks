// Importaciones de validadores de class-validator para validación de datos
import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsOptional,
    IsUUID,
} from "class-validator";
// Importación de transformadores de class-transformer para conversión de datos
import { Transform } from "class-transformer";

// DTO (Data Transfer Object) para crear nuevas tareas
export class CreateTaskDto {
    // Validación del campo título de la tarea
    @IsString({ message: "El título debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El título es obligatorio" })
    @MinLength(2, {
        message: "El título debe tener al menos 2 caracteres",
    })
    @MaxLength(200, {
        message: "El título no puede exceder 200 caracteres",
    })
    // Transformación para limpiar espacios en blanco al inicio y final
    @Transform(({ value }) => value?.trim())
    title: string;

    // Validación del campo descripción (opcional)
    @IsOptional() // Campo opcional, no requerido
    @IsString({
        message: "La descripción debe ser una cadena de texto",
    })
    @MaxLength(1000, {
        message: "La descripción no puede exceder 1000 caracteres",
    })
    // Transformación para limpiar espacios en blanco
    @Transform(({ value }) => value?.trim())
    description?: string; // Opcional

    // Validación del ID del estado de la tarea
    @IsString({
        message: "El ID del estado debe ser una cadena de texto",
    })
    @IsNotEmpty({ message: "El ID del estado es obligatorio" })
    @IsUUID("4", {
        message: "El ID del estado debe ser un UUID válido",
    })
    statusId: string; // UUID del estado de tarea existente
}
