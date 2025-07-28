// Importación del decorador Module de NestJS para definir módulos
import { Module } from "@nestjs/common";
// Módulo para servir archivos estáticos desde el servidor
import { ServeStaticModule } from "@nestjs/serve-static";
// Utilidad de Node.js para manejar rutas de archivos
import { join } from "path";
// Módulo de configuración de NestJS para variables de entorno
import { ConfigModule } from "@nestjs/config";
// Módulo de TypeORM para conexión y manejo de base de datos
import { TypeOrmModule } from "@nestjs/typeorm";
// Importación de módulos personalizados de la aplicación
import { CommonModule } from "./common/common.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TasksStatusesModule } from "./tasks-statuses/tasks-statuses.module";
import { TasksModule } from "./tasks/tasks.module";

// Decorador que define este como el módulo raíz de la aplicación
@Module({
    imports: [
        // Configuración para servir archivos estáticos desde la carpeta public
        ServeStaticModule.forRoot({
            // Define la ruta absoluta hacia la carpeta de archivos estáticos
            rootPath: join(__dirname, "..", "public"),
        }),
        // Configuración global para variables de entorno
        ConfigModule.forRoot(),
        // Configuración de la conexión a la base de datos PostgreSQL
        TypeOrmModule.forRoot({
            // Tipo de base de datos, lee de variable de entorno o usa PostgreSQL por defecto
            type: (process.env.DB_TYPE as any) || "postgres",
            // Host de la base de datos, lee de variable de entorno o usa localhost por defecto
            host: process.env.DB_HOST || "localhost",
            // Puerto de la base de datos, lee de variable de entorno y convierte a número o usa 5432 por defecto
            port: process.env.DB_PORT
                ? parseInt(process.env.DB_PORT)
                : 5432,
            // Usuario de la base de datos, lee de variable de entorno o usa postgres por defecto
            username: process.env.DB_USER || "postgres",
            // Contraseña de la base de datos, lee de variable de entorno o usa postgres por defecto
            password: process.env.DB_PASSWORD || "postgres",
            // Nombre de la base de datos, lee de variable de entorno o usa nest-angular-tasks por defecto
            database: process.env.DB_NAME || "nest-angular-tasks",
            // Carga automáticamente todas las entidades registradas en los módulos
            autoLoadEntities: true,
            // Sincroniza automáticamente el esquema de la base de datos (solo para desarrollo)
            synchronize: true,
            // Habilita el logging de consultas SQL en la consola
            logging: true,
        }),
        // Registro de módulos personalizados de la aplicación
        CommonModule, // Módulo para utilidades y funciones comunes
        AuthModule, // Módulo para autenticación y autorización
        UsersModule, // Módulo para gestión de usuarios
        TasksStatusesModule, // Módulo para gestión de estados de tareas
        TasksModule, // Módulo para gestión de tareas
    ],
    // No hay controladores en el módulo raíz
    controllers: [],
    // No hay proveedores en el módulo raíz
    providers: [],
})
// Clase que representa el módulo principal de la aplicación
export class AppModule {}
