// Importación de la fábrica de NestJS para crear la aplicación
import { NestFactory } from "@nestjs/core";
// Importación del módulo raíz de la aplicación
import { AppModule } from "./app.module";
// Importación del Logger y ValidationPipe de NestJS
import { Logger, ValidationPipe } from "@nestjs/common";

// Función asíncrona que inicializa y configura la aplicación
async function bootstrap() {
    // Creación de una instancia del logger con etiqueta personalizada
    const logger: Logger = new Logger(
        "---------- Bootstrap ----------"
    );

    // Configuración del puerto del servidor desde variable de entorno o 3000 por defecto
    const PORT: number = process.env.PORT
        ? Number(process.env.PORT)
        : 3000;

    // Configuración del prefijo de la API desde variable de entorno o "api/v1" por defecto
    const API_PREFIX: string = process.env.API_PREFIX || "api/v1";

    // Creación de la instancia de la aplicación NestJS
    const app = await NestFactory.create(AppModule);

    // Establecimiento del prefijo global para todas las rutas de la API
    app.setGlobalPrefix(API_PREFIX);

    // Configuración de pipes globales para validación automática
    app.useGlobalPipes(
        new ValidationPipe({
            // Solo permite propiedades definidas en los DTOs
            whitelist: true,
            // Rechaza requests con propiedades no permitidas
            forbidNonWhitelisted: true,
            // Transforma automáticamente los payloads a instancias de DTO
            transform: true,
            transformOptions: {
                // Permite conversión implícita de tipos
                enableImplicitConversion: true,
            },
        })
    );

    // Configuración de CORS para permitir requests desde cualquier origen
    app.enableCors({
        // Permite requests desde cualquier origen
        origin: "*",
        // Permite todos los métodos HTTP
        methods: "*",
        // Permite todos los headers
        allowedHeaders: "*",
        // Permite el envío de cookies y credenciales
        credentials: true,
    });

    // Inicia el servidor en el puerto especificado
    await app.listen(PORT);

    // Log de confirmación de que la aplicación está ejecutándose
    logger.log(
        `Application is running on: http://localhost:${PORT}/${API_PREFIX}`
    );
}

// Ejecuta la función bootstrap para iniciar la aplicación
bootstrap();
