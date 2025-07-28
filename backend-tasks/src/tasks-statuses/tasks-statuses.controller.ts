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
    ParseUUIDPipe,
} from "@nestjs/common";
// Importación del guard de autenticación de Passport
import { AuthGuard } from "@nestjs/passport";
// Importación del guard personalizado para administradores
import { AdminGuard } from "@/common/guards";
// Importación del servicio de estados de tareas
import { TasksStatusesService } from "./tasks-statuses.service";
// Importación de DTOs para crear y actualizar estados de tareas
import { CreateTasksStatusDto, UpdateTasksStatusDto } from "./dto";

// Decorador que define el controlador con prefijo 'tasks-statuses'
@Controller("tasks-statuses")
export class TasksStatusesController {
    // Inyección del servicio de estados de tareas mediante constructor
    constructor(
        private readonly tasksStatusesService: TasksStatusesService
    ) {}

    // Endpoint POST para crear un nuevo estado de tarea (solo administradores)
    @Post()
    @UseGuards(AuthGuard("jwt"), AdminGuard) // Requiere autenticación JWT y rol de admin
    async create(@Body() createTasksStatusDto: CreateTasksStatusDto) {
        // Delega la creación del estado al servicio
        return await this.tasksStatusesService.create(
            createTasksStatusDto
        );
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async findAll() {
        return await this.tasksStatusesService.findAll();
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async findOne(@Param("id") id: string) {
        return await this.tasksStatusesService.findOne(id);
    }

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"), AdminGuard)
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateTasksStatusDto: UpdateTasksStatusDto
    ) {
        return await this.tasksStatusesService.update(
            id,
            updateTasksStatusDto
        );
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"), AdminGuard)
    async remove(@Param("id", ParseUUIDPipe) id: string) {
        return await this.tasksStatusesService.remove(id);
    }
}
