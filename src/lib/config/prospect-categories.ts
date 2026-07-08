export const PROSPECT_CATEGORIES: Record<string, string[]> = {
  Dentistas: ["Dentista", "Dentist", "Clínica Dental", "Dental Clinic", "Odontología"],
  "Clínicas Odontológicas": [
    "Clínica Odontológica",
    "Odontología",
    "Dental Clinic",
    "Ortodoncia",
    "Clínica Dental",
  ],
  Barberías: ["Barbería", "Barber Shop", "Barbershop", "Barber", "Men's Hair Salon"],
  Peluquerías: ["Peluquería", "Hair Salon", "Beauty Salon", "Estilista", "Salón de Belleza"],
  "Clínicas Estéticas": [
    "Clínica Estética",
    "Aesthetic Clinic",
    "Med Spa",
    "Centro de Estética",
    "Cosmetología",
  ],
  Spas: ["Spa", "Day Spa", "Wellness Center", "Centro de Masajes", "Spa y Relajación"],
  Gimnasios: ["Gimnasio", "Gym", "Fitness Center", "Crossfit", "Centro de Entrenamiento"],
  Restaurantes: ["Restaurante", "Restaurant", "Comida", "Food", "Gastronomía"],
  Cafeterías: ["Cafetería", "Cafe", "Coffee Shop", "Café", "Pastelería"],
  Hoteles: ["Hotel", "Hostal", "Boutique Hotel", "Alojamiento", "Motel"],
  "Talleres Automotrices": [
    "Taller Mecánico",
    "Auto Repair",
    "Mecánica Automotriz",
    "Taller Automotriz",
    "Car Service",
  ],
  Inmobiliarias: [
    "Inmobiliaria",
    "Real Estate Agency",
    "Bienes Raíces",
    "Agencia Inmobiliaria",
    "Propiedades",
  ],
  Abogados: ["Abogado", "Law Firm", "Bufete de Abogados", "Asesoría Legal", "Despacho Jurídico"],
  Contadores: [
    "Contador",
    "Accounting Firm",
    "Despacho Contable",
    "Asesoría Contable",
    "Contadores Públicos",
  ],
  Veterinarias: [
    "Veterinaria",
    "Clínica Veterinaria",
    "Veterinary Clinic",
    "Hospital Veterinario",
    "Mascotas",
  ],
  "Agencias de Viajes": [
    "Agencia de Viajes",
    "Travel Agency",
    "Turismo",
    "Tour Operator",
    "Viajes y Turismo",
  ],
  Ferreterías: [
    "Ferretería",
    "Hardware Store",
    "Materiales de Construcción",
    "Tlapalería",
    "Herramientas",
  ],
  Constructoras: [
    "Constructora",
    "Construction Company",
    "Empresa Constructora",
    "Desarrolladora Inmobiliaria",
    "Obras y Proyectos",
  ],
  "Tiendas de Mascotas": [
    "Tienda de Mascotas",
    "Pet Shop",
    "Pet Store",
    "Accesorios para Mascotas",
    "Alimentos para Mascotas",
  ],
  Academias: ["Academia", "Academy", "Centro Educativo", "Escuela", "Instituto"],
};

/**
 * Returns search variants for a given category name.
 * If the category is not found in the config, it returns the category itself as the only variant.
 */
export function getVariantsForCategory(categoryName: string): string[] {
  const normalized = categoryName.trim();
  const variants = PROSPECT_CATEGORIES[normalized];
  return variants && variants.length > 0 ? variants : [normalized];
}
