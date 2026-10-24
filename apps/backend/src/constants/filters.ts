// File: src/constants/filters.ts
// Module responsible for backend functionality.

// Exported symbol CATEGORIES.
export const CATEGORIES = [
  'Becerros', 'Vacas', 'Vacas Preñadas', 'Toros',
  'Mautes', 'Novillas', 'Novillas Preñadas', 'Novillos', 'Toros para padre'
] as const;

// Exported symbol LOCATIONS.
export const LOCATIONS = [
  'Anzoátegui', 'Bolívar', 'Carabobo', 'Cojedes',
  'Lara', 'Mérida', 'Miranda', 'Portuguesa', 'Táchira', 'Zulia'
] as const;

// Exported symbol TYPES.
export const TYPES = ['Machos', 'Hembras', 'Cría'] as const;

// Exported symbol CONDITIONS.
export const CONDITIONS = ['Desconocido', 'Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala'] as const;

// Exported symbol BREEDS.
export const BREEDS = ['Brahman', 'Nelore', 'Guzerát', 'Gir', 'Carora', 'Holstein', 'Jersey', 'Pardo Suizo'] as const;