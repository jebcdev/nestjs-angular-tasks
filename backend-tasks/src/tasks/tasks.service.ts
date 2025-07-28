// Importaciones de excepciones de NestJS para manejo de errores
import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common";
// Decorador para inyección de repositorios TypeORM
import { InjectRepository } from "@nestjs/typeorm";
// Importaciones de TypeORM para operaciones de base de datos
import { Not, Repository } from "typeorm";
// Utilidad para validar UUIDs
import { validate as isUUID } from "uuid";
// Importación de DTOs para crear y actualizar tareas
import { CreateTaskDto, UpdateTaskDto } from "./dto";
// Importación de entidades relacionadas
import { Task } from "./entities/task.entity";
import { User } from "@/users/entities/user.entity";
import { TasksStatus } from "@/tasks-statuses/entities/tasks-status.entity";
// Utilidad para manejo centralizado de errores
import { handleErrors } from "@/common/utils";
// Enum de roles para validaciones de permisos
import { Roles } from "@/common/enums";

// Decorador que marca la clase como un servicio inyectable
@Injectable()
export class TasksService {
    // Constructor con inyección de repositorios
    constructor(
        // Repositorio para operaciones CRUD de tareas
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        // Repositorio para validar usuarios
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        // Repositorio para validar estados de tareas
        @InjectRepository(TasksStatus)
        private readonly tasksStatusRepository: Repository<TasksStatus>
    ) {}

    // Método para crear una nueva tarea
    async create(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task | undefined | null> {
        try {
            // Verificar que el estado de tarea especificado existe
            const taskStatus =
                await this.tasksStatusRepository.findOne({
                    where: { id: createTaskDto.statusId },
                });

            // Si no existe el estado, lanzar excepción
            if (!taskStatus) {
                throw new NotFoundException(
                    `Task status with id ${createTaskDto.statusId} not found`
                );
            }

            // Verificar que no existe otra tarea con el mismo título para este usuario
            const existsTask = await this.taskRepository.findOne({
                where: {
                    title: createTaskDto.title,
                    user: { id: user.id }, // Solo buscar en tareas del usuario actual
                },
            });

            // Si ya existe una tarea con ese título, lanzar excepción
            if (existsTask)
                throw new BadRequestException(
                    `Task with title "${createTaskDto.title}" already exists`
                );

            // Crear la nueva instancia de tarea
            const newTask = this.taskRepository.create({
                ...createTaskDto, // Spread de los datos del DTO
                user: { id: user.id }, // Asignar el usuario autenticado
                status: taskStatus, // Asignar el estado validado
            });

            // Verificar que la tarea se creó correctamente
            if (!newTask)
                throw new BadRequestException("Error creating task");

            // Guardar la tarea en la base de datos
            const savedTask = await this.taskRepository.save(newTask);

            // Verificar que se guardó correctamente
            if (!savedTask)
                throw new BadRequestException("Error saving task");

            // Retornar la tarea completa con relaciones cargadas
            return await this.taskRepository.findOne({
                where: { id: savedTask.id },
                relations: {
                    user: true, // Incluir datos del usuario
                    status: true, // Incluir datos del estado
                },
            });
        } catch (error) {
            // Manejo centralizado de errores
            handleErrors(error);
        }
    }

    // Método para obtener todas las tareas (con lógica de permisos)
    async findAll(user: User): Promise<Task[] | undefined> {
        try {
            // Extraer roles del usuario para verificar permisos
            const { roles } = user;
            // Verificar si el usuario tiene rol de administrador
            const isAdmin = roles.includes(Roles.admin);

            let tasks: Task[] | null = null;

            // Si es administrador, puede ver todas las tareas
            if (isAdmin) {
                tasks = await this.taskRepository.find({
                    relations: {
                        user: true, // Incluir datos del usuario
                        status: true, // Incluir datos del estado
                    },
                });
            } else {
                // Si no es admin, solo puede ver sus propias tareas
                tasks = await this.taskRepository.find({
                    where: { user: { id: user.id } }, // Filtrar por usuario actual
                    relations: {
                        user: true, // Incluir datos del usuario
                        status: true, // Incluir datos del estado
                    },
                });
            }

            // Verificar si se encontraron tareas
            if (!tasks || tasks.length === 0)
                throw new NotFoundException("No tasks found");

            return tasks;
        } catch (error) {
            // Manejo centralizado de errores
            handleErrors(error);
        }
    }

    // Método para obtener una tarea específica por ID
    async findOne(id: string, user: User): Promise<Task | undefined> {
        try {
            // Buscar la tarea por ID con relaciones incluidas
            const task = await this.taskRepository.findOne({
                where: {
                    id, // ID de la tarea a buscar
                },
                relations: {
                    user: true, // Incluir datos del usuario propietario
                    status: true, // Incluir datos del estado
                },
            });

            // Si no se encuentra la tarea, lanzar excepción
            if (!task) {
                throw new NotFoundException(
                    `Task with id ${id} not found or you don't have permission to access it`
                );
            }

            // Verificar permisos: solo el propietario o un admin pueden acceder
            if (
                task.user.id !== user.id &&
                !user.roles.includes(Roles.admin)
            )
                throw new ForbiddenException(
                    `You do not have permission to access this task`
                );

            return task;
        } catch (error) {
            // Manejo centralizado de errores
            handleErrors(error);
        }
    }

    async update(
        id: string,
        updateTaskDto: UpdateTaskDto,
        user: User
    ): Promise<Task | undefined> {
        try {
            const existingTask = await this.taskRepository.findOne({
                where: {
                    id,
                },
                relations: {
                    user: true,
                    status: true,
                },
            });

            if (!existingTask)
                throw new NotFoundException(
                    `Task with id ${id} not found`
                );

            // Verificar permisos: debe ser el propietario de la tarea o un admin
            if (existingTask.user.id !== user.id) {
                if (!user.roles.includes(Roles.admin)) {
                    throw new ForbiddenException(
                        `You do not have permission to update this task`
                    );
                }
            }

            let taskStatus: TasksStatus | null = null;

            // Si se está actualizando el statusId, verificar que existe y obtener la entidad completa
            if (updateTaskDto.statusId) {
                taskStatus = await this.tasksStatusRepository.findOne(
                    {
                        where: { id: updateTaskDto.statusId },
                    }
                );

                if (!taskStatus) {
                    throw new NotFoundException(
                        `Task status with id ${updateTaskDto.statusId} not found`
                    );
                }
            }

            // Verificar si existe otra tarea con el mismo título (si se está actualizando el título)
            if (
                updateTaskDto.title &&
                updateTaskDto.title !== existingTask.title
            ) {
                const taskWithSameTitle =
                    await this.taskRepository.findOne({
                        where: {
                            title: updateTaskDto.title,
                            user: { id: existingTask.user.id },
                            id: Not(id), // Excluir la tarea actual
                        },
                    });

                if (taskWithSameTitle) {
                    throw new BadRequestException(
                        `Task with title "${updateTaskDto.title}" already exists`
                    );
                }
            }

            // Preparar los datos para actualizar
            const updateData: Partial<Task> = {};

            if (updateTaskDto.title) {
                updateData.title = updateTaskDto.title;
            }

            if (updateTaskDto.description !== undefined) {
                updateData.description = updateTaskDto.description;
            }

            if (taskStatus) {
                updateData.status = taskStatus;
            }

            // Actualizar la tarea usando preload para manejar las relaciones correctamente
            const taskToUpdate = await this.taskRepository.preload({
                id: existingTask.id,
                ...updateData,
            });

            if (!taskToUpdate) {
                throw new BadRequestException(
                    "Error preparing task update"
                );
            }

            // Guardar la tarea actualizada
            const savedTask = await this.taskRepository.save(
                taskToUpdate
            );

            if (!savedTask) {
                throw new BadRequestException("Error updating task");
            }

            // Retornar la tarea actualizada con sus relaciones
            const updatedTask = await this.taskRepository.findOne({
                where: { id },
                relations: {
                    user: true,
                    status: true,
                },
            });

            if (!updatedTask) {
                throw new BadRequestException(
                    "Error retrieving updated task"
                );
            }

            return updatedTask;
        } catch (error) {
            handleErrors(error);
        }
    }
    // ...existing code...
    async remove(
        id: string,
        user: User
    ): Promise<boolean | undefined> {
        try {
            const existingTask = await this.taskRepository.findOne({
                where: {
                    id,
                },
                relations: {
                    user: true,
                    status: true,
                },
            });

            if (!existingTask)
                throw new NotFoundException(
                    `Task with id ${id} not found`
                );

            // Verificar permisos: debe ser el propietario de la tarea o un admin
            if (existingTask.user.id !== user.id) {
                if (!user.roles.includes(Roles.admin)) {
                    throw new ForbiddenException(
                        `You do not have permission to delete this task`
                    );
                }
            }

            // Usar softRemove en lugar de remove
            await this.taskRepository.softRemove(existingTask);

            return true;
        } catch (error) {
            handleErrors(error);
        }
    }

    // ...existing code...
}
