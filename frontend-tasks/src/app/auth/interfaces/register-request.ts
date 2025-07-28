// Interfaz que define la estructura de datos para las peticiones de registro de nuevos usuarios
export interface RegisterRequest {
  name: string; // Nombre completo del usuario que se va a registrar
  email: string; // Dirección de correo electrónico única del usuario
  password: string; // Contraseña del usuario en texto plano (será hasheada por el backend)
}
