import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { validate as isUUID } from "uuid";
/*  */
import { CreateTasksStatusDto, UpdateTasksStatusDto } from "./dto";
import { TasksStatus } from "./entities/tasks-status.entity";
import { handleErrors } from "@/common/utils";

@Injectable()
export class TasksStatusesService {
    constructor(
        @InjectRepository(TasksStatus)
        private readonly tasksStatusRepository: Repository<TasksStatus>
    ) {}

    private async initializeDefaultStatuses(): Promise<
        TasksStatus[]
    > {
        const defaultStatuses = [
            { name: "Pendiente", color: "#f59e0b" },
            { name: "En Progreso", color: "#3b82f6" },
            { name: "Completada", color: "#10b981" },
            { name: "Cancelada", color: "#ef4444" },
        ];

        const createdStatuses: TasksStatus[] = [];

        for (const statusData of defaultStatuses) {
            const existingStatus =
                await this.tasksStatusRepository.findOne({
                    where: { name: statusData.name },
                });

            if (!existingStatus) {
                const newStatus =
                    this.tasksStatusRepository.create(statusData);
                const savedStatus =
                    await this.tasksStatusRepository.save(newStatus);
                createdStatuses.push(savedStatus);
            }
        }

        return createdStatuses;
    }

    async create(createTasksStatusDto: CreateTasksStatusDto) {
        try {
            const newTasksStatus = this.tasksStatusRepository.create(
                createTasksStatusDto
            );
            if (!newTasksStatus)
                throw new BadRequestException(
                    "Error creating tasks status"
                );

            const savedTasksStatus =
                await this.tasksStatusRepository.save(newTasksStatus);
            if (!savedTasksStatus)
                throw new BadRequestException(
                    "Error saving tasks status"
                );

            return savedTasksStatus;
        } catch (error) {
            handleErrors(error);
        }
    }

    async findAll() {
        try {
            let tasksStatuses =
                await this.tasksStatusRepository.find();

            // Si no hay estados, crear los estados por defecto
            if (!tasksStatuses || tasksStatuses.length === 0) {
                await this.initializeDefaultStatuses();
                tasksStatuses =
                    await this.tasksStatusRepository.find();
            }

            return tasksStatuses || [];
        } catch (error) {
            handleErrors(error);
        }
    }

    async findOne(id: string) {
        try {
            let tasksStatus: TasksStatus | null;
            if (isUUID(id)) {
                tasksStatus =
                    await this.tasksStatusRepository.findOne({
                        where: { id },
                    });

                if (!tasksStatus)
                    throw new NotFoundException(
                        `Tasks status with id ${id} not found`
                    );
            } else {
                tasksStatus =
                    await this.tasksStatusRepository.findOne({
                        where: { name: id },
                    });
                if (!tasksStatus)
                    throw new NotFoundException(
                        `Tasks status with name ${id} not found`
                    );
            }

            if (!tasksStatus)
                throw new NotFoundException(
                    `Tasks status with id ${id} not found`
                );

            return tasksStatus;
        } catch (error) {
            handleErrors(error);
        }
    }

    async update(
        id: string,
        updateTasksStatusDto: UpdateTasksStatusDto
    ) {
        try {
            const toUpdateTasksStatus = await this.findOne(id);
            if (!toUpdateTasksStatus)
                throw new NotFoundException(
                    `Tasks status with id ${id} not found`
                );
            const updatedTasksStatus =
                await this.tasksStatusRepository.preload({
                    ...toUpdateTasksStatus,
                    ...updateTasksStatusDto,
                });

            if (!updatedTasksStatus)
                throw new BadRequestException(
                    "Error updating tasks status"
                );

            const savedTasksStatus =
                await this.tasksStatusRepository.save(
                    updatedTasksStatus
                );
            if (!savedTasksStatus)
                throw new BadRequestException(
                    "Error saving updated tasks status"
                );

            return savedTasksStatus;
        } catch (error) {
            handleErrors(error);
        }
    }

    async remove(id: string) {
        try {
            const toDeleteTasksStatus = await this.findOne(id);
            if (!toDeleteTasksStatus)
                throw new NotFoundException(
                    `Tasks status with id ${id} not found`
                );

            const deletedTasksStatus =
                await this.tasksStatusRepository.softRemove(
                    toDeleteTasksStatus
                );

            if (!deletedTasksStatus)
                throw new BadRequestException(
                    "Error deleting tasks status"
                );

            return {
                message: `Tasks status with id ${id} deleted successfully`,
            };
        } catch (error) {
            handleErrors(error);
        }
    }
}
