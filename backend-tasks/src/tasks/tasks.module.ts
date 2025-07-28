// Importación del decorador Module de NestJS
import { Module } from "@nestjs/common";
// Importación del servicio de tareas
import { TasksService } from "./tasks.service";
// Importación del controlador de tareas
import { TasksController } from "./tasks.controller";
// Importación de TypeORM para conectar entidades a la base de datos
import { TypeOrmModule } from "@nestjs/typeorm";
// Importación de entidades relacionadas
import { TasksStatus } from "@/tasks-statuses/entities/tasks-status.entity";
import { User } from "@/users/entities/user.entity";
import { Task } from "./entities/task.entity";

// Decorador que define el módulo de tareas
@Module({
    // Controladores que maneja este módulo
    controllers: [TasksController],
    // Módulos importados que este módulo necesita
    imports: [
        // Registro de entidades para poder usarlas en repositorios
        TypeOrmModule.forFeature([User, TasksStatus, Task]),
    ],
    // Servicios que proporciona este módulo
    providers: [TasksService],
})
// Clase que representa el módulo de tareas
export class TasksModule {}
