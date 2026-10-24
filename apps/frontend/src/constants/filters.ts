// File: frontend/src/constants/filters.ts
// Application constants and static values.

// Exported constant FILTERS.
export const FILTERS = {
  TYPES: ['Todos', 'Machos', 'Hembras', 'Cría'],
  CATEGORIES: [
    'Becerros', 'Vacas', 'Vacas Preñadas', 'Toros',
    'Mautes', 'Novillas', 'Novillas Preñadas', 'Novillos', 'Toros para padre'
  ],
  LOCATIONS: [
    'Anzoátegui', 'Bolívar', 'Carabobo', 'Cojedes',
    'Lara', 'Mérida', 'Miranda', 'Portuguesa', 'Táchira', 'Zulia'
  ],
  BREEDS: {
    'Cebú': ['Brahman', 'Nelore', 'Guzerát', 'Gir'],
    'Lecheras': ['Carora', 'Holstein', 'Jersey', 'Pardo Suizo']
  },
  AGES: ['Desconocido', '0-6 meses', '6-12 meses', '1-2 años', '2-4 años', '4+ años'],
  CONDITIONS: ['Desconocido', 'Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala']
};