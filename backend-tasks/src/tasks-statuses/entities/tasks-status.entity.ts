// Importación de la entidad Task para establecer relaciones
import { Task } from "@/tasks/entities/task.entity";
// Importaciones de decoradores de TypeORM para definir entidades y relaciones
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
    ManyToOne,
} from "typeorm";

// Decorador que define esta clase como una entidad de base de datos con nombre 'tasks_statuses'
@Entity("tasks_statuses")
export class TasksStatus {
    // Clave primaria autogenerada de tipo UUID
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // Campo nombre con índice único para evitar estados duplicados
    @Index({ unique: true }) // Crea un índice único en la base de datos
    @Column({
        type: "varchar", // Tipo de datos VARCHAR
        length: 100, // Longitud máxima de 100 caracteres
        unique: true, // Garantiza unicidad a nivel de columna
        nullable: false, // No permite valores nulos
        comment: "Nombre del estado de la tarea", // Comentario en la base de datos
    })
    name: string;

    // Campo descripción opcional para detalles del estado
    @Column({
        type: "text", // Tipo de datos TEXT para textos largos
        nullable: true, // Permite valores nulos (campo opcional)
        comment: "Descripción del estado de la tarea", // Comentario en la base de datos
    })
    description?: string; // Opcional

    // Campo color para representación visual del estado
    @Column({
        type: "varchar", // Tipo de datos VARCHAR
        length: 7, // Longitud de 7 caracteres (formato hex #FFFFFF)
        nullable: false, // No permite valores nulos
        default: "#6B7280", // Color gris por defecto
        comment: "Color hexadecimal para el estado", // Comentario en la base de datos
    })
    color: string;

    // Relación One-to-Many con Task (un estado puede tener muchas tareas)
    @ManyToOne(
        () => Task, // Entidad relacionada
        (task) => task.status, // Campo de la entidad relacionada que apunta a esta
        {
            cascade: true, // Operaciones en cascada
            onDelete: "CASCADE", // Eliminar tareas cuando se elimina el estado
        }
    )
    tasks: Task[];

    // Campo automático para fecha de creación
    @CreateDateColumn()
    createdAt: Date;

    // Campo automático para fecha de última actualización
    @UpdateDateColumn()
    updatedAt: Date;

    // Campo para soft delete (eliminación lógica)
    @DeleteDateColumn()
    deletedAt?: Date; // Opcional para permitir valores nulos
}
