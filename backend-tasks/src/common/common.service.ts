// Importación del decorador Injectable de NestJS
import { Injectable } from "@nestjs/common";

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
// Servicio común para funcionalidades compartidas entre módulos
export class CommonService {}
