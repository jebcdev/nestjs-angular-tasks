// Interfaz que define la estructura de un elemento de menú de navegación
export interface MenuItem {
  title: string; // Texto que se mostrará en el menú de navegación
  path: string; // Ruta de Angular Router hacia la que navegará el elemento del menú
  icon?: string; // Clase CSS del icono opcional (ej: FontAwesome) que se mostrará junto al título
}
