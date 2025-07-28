// Constante que define la clave secreta para firmar y verificar tokens JWT
// Lee desde variable de entorno JWT_SECRET o usa una clave por defecto para desarrollo
export const JWT_SECRET =
    process.env.JWT_SECRET ||
    "8537c7926d83826f4d075c3f94f5752bf246e89efc5cbaf4a146276ce8b9915ab58f298278ff1c20f66d25162d9911b8d1fe6c04c7a5443208aad4c7f91c69c4";
