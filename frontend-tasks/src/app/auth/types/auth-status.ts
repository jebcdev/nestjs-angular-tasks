// Tipo unión que define los posibles estados de autenticación del usuario en la aplicación
export type AuthStatus =
  | 'authenticated' // Usuario autenticado con token válido
  | 'unauthenticated' // Usuario no autenticado o con token inválido/expirado
  | 'unknown'; // Estado inicial o cuando aún se está verificando el estado de autenticación
