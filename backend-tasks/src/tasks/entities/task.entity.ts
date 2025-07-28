// Importación de la entidad TasksStatus para establecer relaciones
import { TasksStatus } from "@/tasks-statuses/entities/tasks-status.entity";
// Importación de la entidad User para establecer relaciones
import { User } from "@/users/entities/user.entity";
// Importaciones de decoradores de TypeORM para definir entidades y relaciones
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
} from "typeorm";

// Decorador que define esta clase como una entidad de base de datos con nombre 'tasks'
@Entity("tasks")
export class Task {
    // Clave primaria autogenerada de tipo UUID
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // Campo título con índice único para evitar tareas duplicadas
    @Index({ unique: true }) // Crea un índice único en la base de datos
    @Column({
        type: "varchar", // Tipo de datos VARCHAR
        unique: true, // Garantiza unicidad a nivel de columna
        length: 200, // Longitud máxima de 200 caracteres
        nullable: false, // No permite valores nulos
        comment: "Título de la tarea", // Comentario en la base de datos
    })
    title: string;

    // Campo descripción opcional para detalles adicionales
    @Column({
        type: "text", // Tipo de datos TEXT para textos largos
        nullable: true, // Permite valores nulos (campo opcional)
        comment: "Descripción detallada de la tarea", // Comentario en la base de datos
    })
    description: string;

    // Relación Many-to-One con User (muchas tareas pertenecen a un usuario)
    @ManyToOne(() => User, (user) => user.tasks, {
        nullable: false, // No permite valores nulos (toda tarea debe tener usuario)
        onDelete: "CASCADE", // Eliminar tarea cuando se elimina el usuario
    })
    user: User;

    // Relación Many-to-One con TasksStatus (muchas tareas tienen un estado)
    @ManyToOne(
        () => TasksStatus,
        (tasksStatus) => tasksStatus.tasks,
        {
            nullable: false, // No permite valores nulos (toda tarea debe tener estado)
            onDelete: "RESTRICT", // No permite eliminar estado si hay tareas asociadas
        }
    )
    status: TasksStatus;

    // Campo automático para fecha de creación
    @CreateDateColumn()
    createdAt: Date;

    // Campo automático para fecha de última actualización
    @UpdateDateColumn()
    updatedAt: Date;

    // Campo para soft delete (eliminación lógica)
    @DeleteDateColumn()
    deletedAt?: Date | null; // Opcional para permitir valores nulos
}
