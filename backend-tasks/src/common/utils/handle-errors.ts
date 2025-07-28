// Importaciones de excepciones HTTP de NestJS para manejo de errores
import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    ConflictException,
    UnprocessableEntityException,
    ForbiddenException,
    UnauthorizedException,
    Logger,
} from "@nestjs/common";

// Interfaz para estandarizar la estructura de detalles de error
interface ErrorDetails {
    code?: string; // Código de error de la base de datos
    message: string; // Mensaje de error
    details?: any; // Detalles adicionales del error
    field?: string; // Campo que causó el error
    constraint?: string; // Restricción violada
    table?: string; // Tabla donde ocurrió el error
    column?: string; // Columna donde ocurrió el error
}

// Mapeo de códigos de error específicos de PostgreSQL y MySQL
const DB_ERROR_CODES = {
    // Códigos de error PostgreSQL
    "23505": {
        type: "UNIQUE_VIOLATION", // Violación de restricción única
        message: "This record already exists",
    },
    "23503": {
        type: "FOREIGN_KEY_VIOLATION", // Violación de clave foránea
        message: "Related record not found",
    },
    "23502": {
        type: "NOT_NULL_VIOLATION", // Violación de NOT NULL
        message: "Required field is missing",
    },
    "23514": {
        type: "CHECK_VIOLATION", // Violación de restricción CHECK
        message: "Value does not meet constraints",
    },
    "42P01": {
        type: "UNDEFINED_TABLE", // Tabla no definida
        message: "Table does not exist",
    },
    "42703": {
        type: "UNDEFINED_COLUMN", // Columna no definida
        message: "Column does not exist",
    },
    "08003": {
        type: "CONNECTION_EXCEPTION", // Excepción de conexión
        message: "Database connection error",
    },
    "08006": {
        type: "CONNECTION_FAILURE", // Fallo de conexión
        message: "Database connection failure",
    },
    "57014": {
        type: "QUERY_CANCELED", // Consulta cancelada
        message: "Query was canceled",
    },
    "53300": {
        type: "TOO_MANY_CONNECTIONS", // Demasiadas conexiones
        message: "Too many database connections",
    },

    // Códigos de error MySQL
    "1062": {
        type: "DUPLICATE_ENTRY", // Entrada duplicada
        message: "Duplicate entry found",
    },
    "1452": {
        type: "FOREIGN_KEY_CONSTRAINT", // Restricción de clave foránea
        message: "Cannot add or update a child row",
    },
    "1048": {
        type: "COLUMN_CANNOT_BE_NULL", // Columna no puede ser null
        message: "Column cannot be null",
    },
    "1146": {
        type: "TABLE_DOESNT_EXIST", // Tabla no existe
        message: "Table does not exist",
    },
    "1054": {
        type: "UNKNOWN_COLUMN", // Columna desconocida
        message: "Unknown column in field list",
    },
    "2002": {
        type: "CONNECTION_ERROR", // Error de conexión
        message: "Cannot connect to database server",
    },
    "1040": {
        type: "TOO_MANY_CONNECTIONS", // Demasiadas conexiones
        message: "Too many connections to database",
    },

    // Códigos adicionales para registros no encontrados
    P2025: {
        type: "RECORD_NOT_FOUND", // Registro no encontrado (Prisma)
        message: "Record not found",
    },
    "23000": {
        type: "INTEGRITY_CONSTRAINT_VIOLATION", // Violación de integridad
        message: "Data integrity violation",
    },
} as const;

// Patrones de expresiones regulares para detectar tipos específicos de error
const ERROR_PATTERNS = [
    {
        // Patrón para violación de restricción única en inglés
        pattern:
            /duplicate key value violates unique constraint "(.+)"/i,
        handler: (match: RegExpMatchArray) => ({
            type: ConflictException,
            message: `Duplicate value found for constraint: ${match[1]}`,
            details: { constraint: match[1] },
        }),
    },
    {
        // Patrón para violación de restricción única en español
        pattern:
            /llave duplicada viola restricción de unicidad «(.+)»/i,
        handler: (match: RegExpMatchArray) => ({
            type: ConflictException,
            message: `El email ya está en uso`,
            details: { constraint: match[1] },
        }),
    },
    {
        // Patrón para violación de clave foránea
        pattern: /violates foreign key constraint "(.+)"/i,
        handler: (match: RegExpMatchArray) => ({
            type: BadRequestException,
            message: `Foreign key constraint violation: ${match[1]}`,
            details: { constraint: match[1] },
        }),
    },
    {
        // Patrón para violación de NOT NULL
        pattern:
            /null value in column "(.+)" violates not-null constraint/i,
        handler: (match: RegExpMatchArray) => ({
            type: BadRequestException,
            message: `Field '${match[1]}' is required`,
            details: { field: match[1] },
        }),
    },
    {
        // Patrón para valor demasiado largo
        pattern:
            /value too long for type character varying\((\d+)\)/i,
        handler: (match: RegExpMatchArray) => ({
            type: BadRequestException,
            message: `Value exceeds maximum length of ${match[1]} characters`,
            details: { maxLength: match[1] },
        }),
    },
    {
        // Patrón para sintaxis inválida de tipo
        pattern: /invalid input syntax for type (.+): "(.+)"/i,
        handler: (match: RegExpMatchArray) => ({
            type: BadRequestException,
            message: `Invalid format for ${match[1]}: ${match[2]}`,
            details: { type: match[1], value: match[2] },
        }),
    },
    {
        // Patrón para registro no encontrado
        pattern:
            /record with id "?(.+)"? (not found|does not exist)/i,
        handler: (match: RegExpMatchArray) => ({
            type: NotFoundException,
            message: `Record with ID '${match[1]}' not found`,
            details: { id: match[1] },
        }),
    },
    {
        // Patrón para ninguna fila afectada
        pattern: /no rows? (affected|updated|deleted)/i,
        handler: () => ({
            type: NotFoundException,
            message: "No records found to update or delete",
            details: {},
        }),
    },
];

// Función principal para manejo robusto de errores y conversión a excepciones HTTP
// Parámetros:
// - error: Error capturado que se va a procesar
// - context: Contexto adicional para el logging (nombre del método, clase, etc.)
// - customMessages: Mapeo de códigos de error a mensajes personalizados
export const handleErrors = (
    error: any,
    context?: string,
    customMessages?: Record<string, string>
): never => {
    // Crear instancia del logger para registrar errores
    const logger = new Logger("ErrorHandler");

    // Registrar el error original con stack trace para debugging
    logger.error(
        `Error in ${context || "Unknown context"}:`,
        error.stack || error
    );

    // Si el error ya es una excepción HTTP de NestJS, lo relanzamos sin procesar
    if (error.response && error.status) {
        throw error;
    }

    // Crear objeto estructurado con los detalles del error
    const errorDetails: ErrorDetails = {
        code: error.code || error.errno || error.sqlState, // Código de error de BD
        message: error.message || "Unknown error", // Mensaje del error
        details: error.detail || error.details, // Detalles adicionales
        field: error.column, // Campo problemático
        constraint: error.constraint, // Restricción violada
        table: error.table, // Tabla afectada
    };

    // Log detallado para debugging con información estructurada
    logger.debug("Error details:", {
        code: errorDetails.code,
        sqlState: error.sqlState,
        errno: error.errno,
        message: errorDetails.message,
        constraint: errorDetails.constraint,
    });

    // Procesamiento basado en código de error de base de datos
    if (errorDetails.code && DB_ERROR_CODES[errorDetails.code]) {
        const dbError = DB_ERROR_CODES[errorDetails.code];
        // Usar mensaje personalizado si existe, sino usar el predeterminado
        const customMessage = customMessages?.[errorDetails.code];
        const message = customMessage || dbError.message;

        // Switch para manejar diferentes tipos de errores de BD
        switch (dbError.type) {
            case "UNIQUE_VIOLATION":
            case "DUPLICATE_ENTRY":
                // Conflicto - recurso ya existe
                throw new ConflictException({
                    message,
                    code: errorDetails.code,
                    type: dbError.type,
                    details: errorDetails.details,
                    constraint: errorDetails.constraint,
                });

            case "FOREIGN_KEY_VIOLATION":
            case "FOREIGN_KEY_CONSTRAINT":
                // Bad request - referencia inválida
                throw new BadRequestException({
                    message,
                    code: errorDetails.code,
                    type: dbError.type,
                    details: errorDetails.details,
                    constraint: errorDetails.constraint,
                });

            case "NOT_NULL_VIOLATION":
            case "COLUMN_CANNOT_BE_NULL":
                // Bad request - campo requerido faltante
                throw new BadRequestException({
                    message,
                    code: errorDetails.code,
                    type: dbError.type,
                    field:
                        errorDetails.field || errorDetails.constraint,
                    details: errorDetails.details,
                });

            case "CHECK_VIOLATION":
                // Unprocessable entity - datos no válidos
                throw new UnprocessableEntityException({
                    message,
                    code: errorDetails.code,
                    type: dbError.type,
                    details: errorDetails.details,
                    constraint: errorDetails.constraint,
                });

            case "UNDEFINED_TABLE":
            case "TABLE_DOESNT_EXIST":
            case "UNDEFINED_COLUMN":
            case "UNKNOWN_COLUMN":
                // Error interno - problema de esquema de BD
                throw new InternalServerErrorException({
                    message: "Database schema error",
                    code: errorDetails.code,
                    type: dbError.type,
                });

            case "CONNECTION_EXCEPTION":
            case "CONNECTION_FAILURE":
            case "CONNECTION_ERROR":
            case "TOO_MANY_CONNECTIONS":
            case "QUERY_CANCELED":
                // Error interno - problema de conectividad
                throw new InternalServerErrorException({
                    message: "Database connection error",
                    code: errorDetails.code,
                    type: dbError.type,
                });

            case "RECORD_NOT_FOUND":
                // Not found - registro no existe
                throw new NotFoundException({
                    message,
                    code: errorDetails.code,
                    type: dbError.type,
                    details: errorDetails.details,
                });

            case "INTEGRITY_CONSTRAINT_VIOLATION":
                // Bad request - violación de integridad de datos
                throw new BadRequestException({
                    message,
                    code: errorDetails.code,
                    type: dbError.type,
                    details: errorDetails.details,
                });
        }
    }

    // Procesamiento basado en patrones de mensaje de error
    for (const pattern of ERROR_PATTERNS) {
        const match = errorDetails.message.match(pattern.pattern);
        if (match) {
            // Si encuentra un patrón, usa el handler correspondiente
            const result = pattern.handler(match);
            throw new result.type({
                message: result.message,
                details: result.details,
                originalMessage: errorDetails.message,
            });
        }
    }

    // Manejo de errores de validación de datos
    if (error.name === "ValidationError" || error.errors) {
        const validationErrors = Array.isArray(error.errors)
            ? error.errors
            : Object.values(error.errors || {});

        throw new BadRequestException({
            message: "Validation failed",
            errors: validationErrors,
            details: errorDetails.details,
        });
    }

    // Manejo de errores de conversión de tipo (cast errors)
    if (error.name === "CastError") {
        throw new BadRequestException({
            message: `Invalid ${error.kind}: ${error.value}`,
            field: error.path,
            value: error.value,
            expectedType: error.kind,
        });
    }

    // Manejo de errores de timeout
    if (
        error.code === "ECONNABORTED" ||
        error.message?.includes("timeout")
    ) {
        throw new InternalServerErrorException({
            message: "Operation timed out",
            details: errorDetails.details,
        });
    }

    // Manejo de errores de conexión de red
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        throw new InternalServerErrorException({
            message: "Service temporarily unavailable",
            code: error.code,
            details: errorDetails.details,
        });
    }

    // Manejo de errores de autorización
    if (
        error.message?.toLowerCase().includes("unauthorized") ||
        error.message?.toLowerCase().includes("access denied")
    ) {
        throw new UnauthorizedException({
            message: "Access denied",
            details: errorDetails.details,
        });
    }

    // Manejo de errores de permisos
    if (
        error.message?.toLowerCase().includes("forbidden") ||
        error.message?.toLowerCase().includes("permission denied")
    ) {
        throw new ForbiddenException({
            message: "Insufficient permissions",
            details: errorDetails.details,
        });
    }

    // Manejo de errores de recurso no encontrado
    if (
        error.message?.toLowerCase().includes("not found") ||
        error.message?.toLowerCase().includes("does not exist") ||
        error.message?.toLowerCase().includes("no rows affected") ||
        error.code === "P2025" || // Código específico de Prisma para record not found
        error.name === "NotFoundError"
    ) {
        throw new NotFoundException({
            message: "Resource not found",
            details: errorDetails.details,
            originalMessage: errorDetails.message,
        });
    }

    // Log de advertencia para errores no manejados específicamente
    logger.warn("Unhandled error type:", {
        name: error.name,
        code: errorDetails.code,
        message: errorDetails.message,
        context,
    });

    // Error genérico como último recurso - incluye detalles en desarrollo
    throw new InternalServerErrorException({
        message: "An unexpected error occurred",
        // Solo incluir detalles técnicos en ambiente de desarrollo
        ...(process.env.NODE_ENV === "development" && {
            originalError: errorDetails.message,
            code: errorDetails.code,
            details: errorDetails.details,
        }),
    });
};

// Función wrapper para manejo automático de errores en operaciones async/await
// Parámetros:
// - operation: Función asíncrona que se va a ejecutar
// - context: Contexto para logging
// - customMessages: Mensajes personalizados para códigos específicos
export const handleAsyncErrors = async <T>(
    operation: () => Promise<T>,
    context?: string,
    customMessages?: Record<string, string>
): Promise<T> => {
    try {
        // Ejecuta la operación
        return await operation();
    } catch (error) {
        // Si hay error, lo maneja automáticamente
        return handleErrors(error, context, customMessages);
    }
};

// Decorador para manejo automático de errores en métodos de clase
// Parámetros:
// - context: Contexto opcional para logging
// - customMessages: Mensajes personalizados opcionales
export const HandleErrors = (
    context?: string,
    customMessages?: Record<string, string>
) => {
    return function (
        target: any, // Clase objetivo
        propertyKey: string, // Nombre del método
        descriptor: PropertyDescriptor // Descriptor del método
    ) {
        // Guarda referencia al método original
        const originalMethod = descriptor.value;

        // Reemplaza el método con una versión que maneja errores
        descriptor.value = async function (...args: any[]) {
            try {
                // Ejecuta el método original con los argumentos
                return await originalMethod.apply(this, args);
            } catch (error) {
                // Maneja cualquier error que ocurra
                handleErrors(
                    error,
                    `${target.constructor.name}.${propertyKey}`, // Contexto automático
                    customMessages
                );
            }
        };

        // Retorna el descriptor modificado
        return descriptor;
    };
};
