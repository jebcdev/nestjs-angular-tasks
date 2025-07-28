// Importación del decorador Module de NestJS
import { Module } from "@nestjs/common";
// Importación del servicio común
import { CommonService } from "./common.service";

// Decorador que define el módulo común para utilidades compartidas
@Module({
    // Registro del servicio común como proveedor
    providers: [CommonService],
    // Exportación del servicio para que otros módulos puedan usarlo
    exports: [CommonService],
})
// Clase que representa el módulo común de la aplicación
export class CommonModule {}
