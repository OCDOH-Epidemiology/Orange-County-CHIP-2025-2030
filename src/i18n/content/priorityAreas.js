/**
 * Spanish translations for priority area content from chip-data.json.
 * 
 * This file provides Spanish translations for dynamic content that comes from
 * the CHIP data file. Translations are keyed by the priority area ID.
 * 
 * HOW TO UPDATE SPANISH TRANSLATIONS:
 * 1. Find the priority area ID (e.g., "nutrition-security")
 * 2. Update the corresponding entry in the `es` object below
 * 3. Keep the same structure as the English data in chip-data.json
 * 
 * HOW TO ADD A THIRD LANGUAGE:
 * 1. Create a new object (e.g., `fr` for French) following the same structure
 * 2. Add it to the `contentTranslations` export at the bottom
 * 3. Update src/i18n/LanguageContext.jsx to add the new language code to SUPPORTED_LANGUAGES
 * 4. Create a new locale file in src/i18n/locales/ (e.g., fr.js) for UI chrome
 * 
 * NOTE: Organization names (partners) are generally NOT translated as they
 * are proper nouns. Only translate descriptive fields like goals and strategies.
 */

const es = {
  // Nutrition Security priority area
  'nutrition-security': {
    domain: 'Estabilidad Económica',
    priority: 'Seguridad Nutricional',
    goal: 'Aumentar la Seguridad Alimentaria',
    disparityAddressed: 'Personas con bajo nivel socioeconómico',
    evidenceBasedStrategy: 'Realizar evaluaciones estandarizadas de necesidades nutricionales no satisfechas y proporcionar referencias a programas de beneficios estatales, locales y federales y a proveedores comunitarios de necesidades sociales relacionadas con la salud para abordar las necesidades no satisfechas.',
    outcome: 'Mayor número de residentes con inseguridad alimentaria conectados a recursos',
    objective: {
      description: 'Para el 31 de diciembre de 2030, aumentar la seguridad alimentaria entre adultos que ganan menos de $25,000 en un 5% del 78% al 81.9%.',
      metric: 'Seguridad alimentaria entre adultos que ganan menos de $25,000',
    },
    milestones: {
      '3.1-m1': {
        description: 'Establecer una línea base de organizaciones comunitarias que actualmente evalúan la seguridad alimentaria con el Grupo de Trabajo de Seguridad Alimentaria y Alimentación Saludable del Condado de Orange.',
      },
      '3.1-m2': {
        description: 'Aumentar el número de organizaciones comunitarias que realizan evaluaciones estandarizadas de seguridad alimentaria y referencias en 5 instalaciones.',
      },
    },
  },

  // Anxiety and Stress priority area
  'anxiety-stress': {
    domain: 'Contexto Social y Comunitario',
    priority: 'Ansiedad y Estrés',
    goal: 'Disminuir la ansiedad y el estrés',
    disparityAddressed: 'Personas con bajo nivel socioeconómico',
    evidenceBasedStrategy: 'Promover y aumentar la conciencia de recursos de atención plena basados en evidencia para reducir el impacto negativo del estrés y el trauma.',
    outcome: 'Mayor número de residentes con herramientas para reducir el estrés y la ansiedad',
    objective: {
      description: 'Para el 31 de diciembre de 2030, disminuir el porcentaje de adultos en hogares con un ingreso anual de menos de $25,000 que experimentan angustia mental moderada o severa en un 5% del 47% al 44%.',
      metric: 'Adultos que ganan menos de $25,000 con angustia mental moderada o severa',
    },
    milestones: {
      '5.1-m1': {
        description: 'Capacitar al menos a un Educador de Salud Pública Senior del Departamento de Salud del Condado de Orange en las técnicas de Respiración, Cuerpo y Mente patrocinadas por la Oficina de Servicios de Adicción y Apoyos.',
      },
      '5.1-m2': {
        description: 'Desarrollar un plan de alcance para identificar oportunidades de alcance para trabajar con la población objetivo.',
      },
      '5.1-m3': {
        description: 'Proporcionar al menos 2 capacitaciones a la población objetivo.',
      },
    },
  },

  // Colorectal Cancer Screening priority area
  'crc-screening': {
    domain: 'Acceso y Calidad de la Atención Médica',
    priority: 'Servicios Preventivos para la Prevención y Control de Enfermedades Crónicas',
    goal: 'Aumentar los Exámenes de Detección de Cáncer Colorrectal',
    disparityAddressed: 'Personas con seguro insuficiente y sin seguro',
    evidenceBasedStrategy: 'Trabajar con el Programa de Detección de Cáncer del Estado de Nueva York para mejorar el acceso a exámenes de detección de cáncer y pruebas de diagnóstico para personas con seguro insuficiente o sin seguro médico.',
    outcome: 'Mayor número de adultos capaces de recibir exámenes de detección de cáncer colorrectal',
    objective: {
      description: 'Para el 31 de diciembre de 2030, aumentar el porcentaje de adultos de 45 a 75 años que reciben un examen de detección de cáncer colorrectal según las guías más recientes en un 5% del 75.1% al 78.8%.',
      metric: 'Adultos de 45 a 75 años al día con exámenes de detección de cáncer colorrectal',
    },
    milestones: {
      '33.0-m1': {
        description: 'Proporcionar al menos 3 eventos de detección con oportunidades para recibir exámenes de detección colorrectal o kits de prueba.',
      },
      '33.0-m2': {
        description: 'Aumentar el número promedio de asistentes a eventos de detección de 200 a 250.',
      },
      '33.0-m3': {
        description: 'Aumentar el número de médicos inscritos en el Programa de Servicios de Cáncer del Valle del Hudson en 5.',
      },
    },
  },
};

/**
 * All content translations keyed by language code.
 * Add new language translations here.
 */
export const contentTranslations = {
  es,
  // Add more languages here:
  // fr: { ... },
  // zh: { ... },
};

/**
 * Get a translated value for a priority area field.
 * Falls back to the original English value if no translation exists.
 * 
 * @param {string} language - Language code (e.g., 'es')
 * @param {string} priorityId - Priority area ID (e.g., 'nutrition-security')
 * @param {string} field - Field path (e.g., 'goal' or 'objective.description')
 * @param {*} fallback - Fallback value if no translation exists
 * @returns {*} Translated value or fallback
 */
export function getContentTranslation(language, priorityId, field, fallback) {
  // English doesn't need translation
  if (language === 'en') return fallback;
  
  const langTranslations = contentTranslations[language];
  if (!langTranslations) return fallback;
  
  const priorityTranslations = langTranslations[priorityId];
  if (!priorityTranslations) return fallback;
  
  // Handle nested paths like 'objective.description'
  const value = field.split('.').reduce((obj, key) => {
    return obj && typeof obj === 'object' ? obj[key] : undefined;
  }, priorityTranslations);
  
  return value !== undefined ? value : fallback;
}

/**
 * Get a translated milestone description.
 * 
 * @param {string} language - Language code
 * @param {string} priorityId - Priority area ID
 * @param {string} milestoneId - Milestone ID
 * @param {string} fallback - Original description
 * @returns {string} Translated description or fallback
 */
export function getMilestoneTranslation(language, priorityId, milestoneId, fallback) {
  if (language === 'en') return fallback;
  
  const langTranslations = contentTranslations[language];
  if (!langTranslations) return fallback;
  
  const priorityTranslations = langTranslations[priorityId];
  if (!priorityTranslations?.milestones) return fallback;
  
  return priorityTranslations.milestones[milestoneId]?.description || fallback;
}
