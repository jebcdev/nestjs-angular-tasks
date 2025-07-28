// Interfaz que define la estructura de datos para las peticiones de inicio de sesión
export interface LoginRequest {
  email: string; // Dirección de correo electrónico del usuario para autenticación
  password: string; // Contraseña del usuario en texto plano (será procesada por el backend)
}
