import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsOptional,
    Matches,
    IsHexColor,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateTasksStatusDto {
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

    @IsOptional()
    @IsString({
        message: "La descripción debe ser una cadena de texto",
    })
    @MaxLength(500, {
        message: "La descripción no puede exceder 500 caracteres",
    })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @IsString({ message: "El color debe ser una cadena de texto" })
    @IsNotEmpty({ message: "El color es obligatorio" })
    @IsHexColor({
        message: "El color debe ser un código hexadecimal válido",
    })
    @MaxLength(7, {
        message: "El color no puede exceder 7 caracteres",
    })
    @Transform(({ value }) => value?.trim().toUpperCase())
    color: string;
}
