// Importación de la librería bcryptjs para el hash de contraseñas
import * as bcrypt from "bcryptjs";

// Configuración del salt para bcrypt desde variable de entorno o 10 por defecto
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT || "10");

// Función asíncrona para generar hash de una contraseña
const HashPassword = async (password: string): Promise<string> => {
    try {
        // Genera un salt con la complejidad especificada
        const salt = await bcrypt.genSalt(BCRYPT_SALT);
        // Genera el hash de la contraseña usando el salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Verifica que el hash se haya generado correctamente
        if (!hashedPassword) {
            throw new Error("Error hashing password");
        }

        // Retorna la contraseña hasheada
        return hashedPassword;
    } catch (error) {
        // Log del error para debugging
        console.error("Hash Password Error:", error);
        // Lanza un error genérico para no exponer detalles internos
        throw new Error("Error hashing password");
    }
};

// Función asíncrona para comparar una contraseña con su hash
const ComparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    try {
        // Compara la contraseña en texto plano con el hash
        const isMatch = await bcrypt.compare(
            password,
            hashedPassword
        );
        // Retorna true si coinciden, false si no
        return isMatch;
    } catch (error) {
        // Log del error para debugging
        console.error("Compare Password Error:", error);
        // Lanza un error genérico para no exponer detalles internos
        throw new Error("Error comparing password");
    }
};

// Exportación de las utilidades de bcrypt como un objeto
export const BcryptUtil = {
    HashPassword,
    ComparePassword,
};
