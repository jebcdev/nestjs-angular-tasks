// Importación de PartialType para crear DTOs parciales
import { PartialType } from "@nestjs/mapped-types";
// Importación del DTO base para crear tareas
import { CreateTaskDto } from "./create-task.dto";

// DTO para actualización de tareas que hereda de CreateTaskDto pero hace todos los campos opcionales
// PartialType convierte automáticamente todos los campos requeridos en opcionales
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    // Hereda: title?, description?, statusId? (todos opcionales)
    // Mantiene todas las validaciones cuando los campos son proporcionados
}
