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
// Importación del enum de roles desde el módulo común
import { Roles } from "@/common/enums";
// Importación de la entidad Task para establecer relaciones
import { Task } from "@/tasks/entities/task.entity";

// Decorador que define esta clase como una entidad de base de datos con nombre 'users'
@Entity("users")
export class User {
    // Clave primaria autogenerada de tipo UUID
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // Campo nombre con validaciones de base de datos
    @Column({
        type: "varchar", // Tipo de datos VARCHAR
        length: 100, // Longitud máxima de 100 caracteres
        nullable: false, // No permite valores nulos
        comment: "Nombre del usuario", // Comentario en la base de datos
    })
    name: string;

    // Campo email con índice único para garantizar unicidad
    @Index({ unique: true }) // Crea un índice único en la base de datos
    @Column({
        type: "varchar", // Tipo de datos VARCHAR
        length: 150, // Longitud máxima de 150 caracteres
        unique: true, // Garantiza unicidad a nivel de columna
        nullable: false, // No permite valores nulos
        comment: "Email del usuario", // Comentario en la base de datos
    })
    email: string;

    // Campo contraseña con configuración especial para seguridad
    @Column({
        type: "varchar", // Tipo de datos VARCHAR
        length: 255, // Longitud máxima de 255 caracteres (para hash)
        nullable: false, // No permite valores nulos
        select: false, // No incluye este campo por defecto en las consultas SELECT
        comment: "Contraseña del usuario", // Comentario en la base de datos
    })
    password?: string; // Opcional para permitir exclusión en consultas

    // Campo roles como array de enums
    @Column({
        type: "enum", // Tipo de datos ENUM
        enum: Roles, // Usa el enum Roles definido
        array: true, // Permite array de valores enum (PostgreSQL)
        default: [Roles.user], // Valor por defecto: rol de usuario
        nullable: false, // No permite valores nulos
        comment: "Roles del usuario", // Comentario en la base de datos
    })
    roles: Roles[];

    // Campo virtual para token JWT (no se almacena en base de datos)
    token?: string;

    // Relación Many-to-One con la entidad Task (un usuario tiene muchas tareas)
    @ManyToOne(
        () => Task, // Entidad relacionada
        (task) => task.user, // Campo de la entidad relacionada que apunta a esta
        {
            cascade: true, // Operaciones en cascada
            onDelete: "CASCADE", // Eliminar tareas cuando se elimina el usuario
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
