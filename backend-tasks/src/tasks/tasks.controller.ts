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
    Request,
    ParseUUIDPipe,
} from "@nestjs/common";
// Importación del guard de autenticación de Passport
import { AuthGuard } from "@nestjs/passport";
// Importación del servicio de tareas
import { TasksService } from "./tasks.service";
// Importación de los DTOs para crear y actualizar tareas
import { CreateTaskDto, UpdateTaskDto } from "./dto";
// Importación de la entidad User
import { User } from "@/users/entities/user.entity";

// Decorador que define el controlador con prefijo 'tasks'
@Controller("tasks")
@UseGuards(AuthGuard("jwt")) // Aplica autenticación JWT a todas las rutas del controlador
export class TasksController {
    // Inyección del servicio de tareas mediante constructor
    constructor(private readonly tasksService: TasksService) {}

    // Endpoint POST para crear una nueva tarea
    @Post()
    create(
        @Body() createTaskDto: CreateTaskDto,
        @Request() req: any
    ) {
        // Extrae el usuario autenticado de la request
        const user: User = req.user;
        // Delega la creación de la tarea al servicio
        return this.tasksService.create(createTaskDto, user);
    }

    // Endpoint GET para obtener todas las tareas del usuario
    @Get()
    findAll(@Request() req: any) {
        // Extrae el usuario autenticado de la request
        const user: User = req.user;
        // Delega la búsqueda de tareas al servicio
        return this.tasksService.findAll(user);
    }

    // Endpoint GET para obtener una tarea específica por ID
    @Get(":id")
    findOne(
        @Param("id", ParseUUIDPipe) id: string,
        @Request() req: any
    ) {
        // ParseUUIDPipe valida que el parámetro id sea un UUID válido
        const user: User = req.user;
        // Delega la búsqueda de la tarea al servicio
        return this.tasksService.findOne(id, user);
    }

    // Endpoint PATCH para actualizar una tarea existente
    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req: any
    ) {
        // Extrae el usuario autenticado de la request
        const user: User = req.user;
        // Delega la actualización de la tarea al servicio
        return this.tasksService.update(id, updateTaskDto, user);
    }

    // Endpoint DELETE para eliminar una tarea (soft delete)
    @Delete(":id")
    remove(
        @Param("id", ParseUUIDPipe) id: string,
        @Request() req: any
    ) {
        // ParseUUIDPipe valida que el parámetro id sea un UUID válido
        const user: User = req.user;
        // Delega la eliminación de la tarea al servicio
        return this.tasksService.remove(id, user);
    }
}
