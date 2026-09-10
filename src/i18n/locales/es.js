/**
 * Spanish (es) locale — UI chrome and static page content.
 */
export default {
  // Language metadata
  meta: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
  },

  // Navigation
  nav: {
    overview: 'Resumen',
    timeline: 'Cronograma',
    partners: 'Socios',
    dataMethodology: 'Datos y Metodología',
    getInvolved: 'Participe',
    toggleMenu: 'Alternar navegación',
    skipToMain: 'Saltar al contenido principal',
  },

  // Language switcher
  languageSwitcher: {
    label: 'Idioma',
    switchTo: 'English',
    currentLanguage: 'Idioma actual: Español',
    changeLanguage: 'Cambiar idioma',
  },

  // Common UI elements
  common: {
    backToOverview: 'Volver al resumen',
    seeFullDetails: 'Ver detalles completos',
    opensInNewTab: '(se abre en una nueva pestaña)',
    loading: 'Cargando…',
    error: 'Error',
    notFound: 'No encontrado',
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
  },

  // Document titles (used with useDocumentTitle)
  titles: {
    overview: 'Resumen',
    timeline: 'Cronograma',
    partners: 'Directorio de Socios',
    dataMethodology: 'Datos y Metodología',
    getInvolved: 'Participe',
    priorityNotFound: 'Área Prioritaria No Encontrada',
    baseTitle: 'Panel CHIP del Condado de Orange',
  },

  // Breadcrumbs
  breadcrumbs: {
    overview: 'Resumen',
    timeline: 'Cronograma',
    partners: 'Socios',
    dataMethodology: 'Datos y Metodología',
    getInvolved: 'Participe',
  },

  // Landing page
  landing: {
    tagline: 'Plan de Mejora de la Salud Comunitaria • 2025–2030',
    title: 'Seguimiento de las prioridades de salud pública del Condado de Orange.',
    intro: 'Un Plan de Mejora de la Salud Comunitaria es una hoja de ruta pública de cinco años para mejorar la salud de una comunidad. Identifica las necesidades de salud más urgentes, establece metas medibles y nombra a los socios que realizan el trabajo. Este panel muestra en qué está trabajando el Condado de Orange y cómo está progresando.',
    howDataWorks: 'Cómo funcionan los datos',
    getInvolved: 'Participe',
    priorityAreasTitle: 'Las tres áreas prioritarias',
    priorityAreasIntro: 'Cada área prioritaria aborda una disparidad de salud específica en el Condado de Orange. Haga clic en cualquier tarjeta para ver los hitos, los socios y la estrategia utilizada.',
    exploreTitle: 'Explore el plan',
    tiles: {
      timeline: {
        title: 'Cronograma',
        body: 'Vea todos los hitos de 2026 a 2030 en una vista cronológica.',
      },
      partners: {
        title: 'Directorio de socios',
        body: 'Todos los socios líderes y asesores en las tres áreas prioritarias.',
      },
      methodology: {
        title: 'Datos y metodología',
        body: 'Fuentes de datos, años de encuestas y qué significan realmente los números.',
      },
      getInvolved: {
        title: 'Participe',
        body: 'Cómo los residentes y organizaciones pueden unirse a un grupo de trabajo o compartir comentarios.',
      },
    },
  },

  // Timeline page
  timeline: {
    title: 'Cronograma: 2026 – 2030',
    intro: 'Todos los hitos de las tres áreas prioritarias del Plan de Mejora de la Salud Comunitaria, en el orden en que están programados para completarse. Los puntos de colores identifican a qué área prioritaria pertenece cada hito.',
    legendLabel: 'Leyenda de áreas prioritarias',
  },

  // Partners page
  partners: {
    title: 'Directorio de socios',
    intro: '{count} organizaciones están nombradas en las tres áreas prioritarias del Plan de Mejora de la Salud Comunitaria como socios líderes o asesores.',
    filters: {
      priorityArea: 'Área prioritaria',
      allPriorityAreas: 'Todas las áreas prioritarias',
      role: 'Rol',
      leadAndAdvisory: 'Líderes y asesores',
      leadOnly: 'Solo líderes',
      advisoryOnly: 'Solo asesores',
      search: 'Buscar',
      searchPlaceholder: 'Nombre de la organización…',
    },
    showingResults: 'Mostrando {filtered} de {total} asignaciones de socios.',
    tableHeaders: {
      organization: 'Organización',
      priorityArea: 'Área prioritaria',
      role: 'Rol',
      activityStatus: 'Estado de actividad',
    },
    noMatches: 'Ningún socio coincide con esos filtros.',
    statusNotSet: 'estado no establecido',
  },

  // Data & Methodology page
  methodology: {
    title: 'Datos y Metodología',
    intro: 'Cómo se producen los números en este panel y qué significan.',
    sections: {
      whatIsCHIP: {
        title: '¿Qué es un Plan de Mejora de la Salud Comunitaria?',
        content: [
          'Un Plan de Mejora de la Salud Comunitaria es una estrategia de salud pública de cinco años requerida por el Estado de Nueva York. Identifica los problemas de salud más urgentes en un condado, elige un pequeño número de prioridades que el departamento de salud local y sus socios pueden abordar de manera realista, y se compromete con objetivos medibles con hitos anuales.',
          'El Plan de Mejora de la Salud Comunitaria 2025–2030 del Condado de Orange fue desarrollado utilizando el marco de Movilización para la Acción a través de la Planificación y las Asociaciones. Las prioridades fueron elegidas a través de encuestas comunitarias, votación de socios en la Cumbre de Salud del Condado de Orange, y una encuesta de proveedores de salud y servicios humanos, junto con datos cuantitativos de la Evaluación de Salud Comunitaria.',
        ],
      },
      dataSources: {
        title: 'De dónde vienen los números',
        intro: 'Cada objetivo de área prioritaria tiene una fuente de datos específica y frecuencia de informes:',
        reported: 'informado {frequency}',
        uniqueSources: 'Fuentes de datos únicas en el plan:',
      },
      progressBars: {
        title: 'Cómo leer las barras de progreso',
        content: [
          'Cada objetivo tiene tres números: una **línea base** (la medición inicial), una **meta** (dónde el Departamento de Salud del Condado de Orange pretende estar para 2030), y un **valor actual** (la medición más reciente).',
          'Algunos objetivos usan **metas de aumento** (por ejemplo, más adultos examinados para cáncer colorrectal) y algunos usan **metas de disminución** (por ejemplo, menos adultos que reportan angustia mental). La barra de progreso siempre se llena hacia la meta, por lo que una barra más llena siempre significa mejor rendimiento independientemente de la dirección.',
          'Donde vea "línea base establecida, seguimiento por comenzar", aún no se ha recopilado una nueva medición. Esto es esperado en los primeros años de un plan de cinco años y no es una brecha de datos; el panel comenzará a mostrar progreso una vez que llegue la próxima encuesta o conjunto de datos administrativos.',
        ],
      },
      milestoneStatus: {
        title: 'Estado de los hitos',
        intro: 'Cada hito anual tiene uno de tres estados:',
        statuses: {
          notStarted: '**No iniciado** — el hito está programado pero el trabajo aún no ha comenzado.',
          inProgress: '**En progreso** — el trabajo está en marcha y se está rastreando en la base de datos de evaluación del Plan de Mejora de la Salud Comunitaria.',
          complete: '**Completado** — se ha alcanzado la meta del hito.',
        },
      },
      partnerActivity: {
        title: 'Una nota sobre la actividad de los socios',
        content: 'Cada socio mostrado en el panel tiene una pequeña etiqueta de "estado de actividad" junto a su nombre. Estas etiquetas son establecidas por el personal del Departamento de Salud del Condado de Orange y describen la participación actual del socio en el grupo de trabajo para esa área prioritaria. Los criterios exactos para lo que cuenta como "activo" versus "comprometido" están siendo definidos por el Departamento de Salud del Condado de Orange — el panel muestra lo que dice la etiqueta sin inferir significado.',
      },
      dataNotes: {
        title: 'Notas de datos',
      },
      limitations: {
        title: 'Limitaciones',
        items: [
          'Los objetivos a largo plazo se actualizan mediante encuestas; la Encuesta de Salud Comunitaria del Condado de Orange se realiza aproximadamente cada tres años, y la Encuesta de Vigilancia de Factores de Riesgo del Comportamiento del Estado de Nueva York se actualiza en un ciclo estatal. Entre encuestas, solo cambian los indicadores de proceso a corto plazo.',
          'El estado de los hitos refleja la revisión más reciente del grupo de trabajo del Departamento de Salud del Condado de Orange. Los datos se actualizan trimestralmente durante las reuniones del Comité Directivo.',
          'El Plan de Mejora de la Salud Comunitaria aborda solo tres áreas prioritarias por diseño; otros problemas importantes en el Condado de Orange son abordados por coaliciones separadas, planes y departamentos del condado referenciados en la narrativa del plan.',
        ],
      },
    },
  },

  // Get Involved page
  getInvolved: {
    title: 'Participe',
    intro: 'La salud del Condado de Orange mejora cuando los residentes, trabajadores y organizaciones se asocian con el departamento de salud. Aquí hay tres formas en que puede ayudar a avanzar el Plan de Mejora de la Salud Comunitaria.',
    sections: {
      joinWorkgroup: {
        title: 'Únase a un grupo de trabajo de área prioritaria',
        content: 'Cada área prioritaria tiene un grupo de trabajo dirigido por el Departamento de Salud del Condado de Orange que se reúne mensual o trimestralmente. Los grupos de trabajo planifican eventos, revisan datos y coordinan la actividad de los socios. Cualquier persona con experiencia vivida, experiencia profesional o alcance comunitario en estos temas es bienvenida a participar.',
      },
      shareExperience: {
        title: 'Comparta su experiencia',
        content: [
          'El Plan de Mejora de la Salud Comunitaria se construyó con más de 2,200 voces de residentes a través de la Encuesta de Salud Comunitaria del Condado de Orange, grupos focales con miembros de la comunidad subrepresentados y entrevistas con informantes clave. El Departamento de Salud del Condado de Orange continúa recopilando comentarios de la comunidad durante todo el año.',
          'Si desea compartir su experiencia con la seguridad alimentaria, la salud mental o el acceso a atención preventiva en el Condado de Orange, comuníquese a través de la información de contacto a continuación.',
        ],
      },
      attendUpdate: {
        title: 'Asista a una actualización pública',
        intro: 'El progreso del Plan de Mejora de la Salud Comunitaria se comparte públicamente en:',
        events: {
          miniSummits: '**Mini-Cumbres Anuales** — actualizaciones específicas de prioridad, una por área prioritaria cada año.',
          healthSummit: '**Cumbre de Salud del Condado de Orange** — una reunión bienal que comienza en 2027 con los tres grupos de trabajo y el Comité Directivo.',
          steeringCommittee: '**Reuniones del Comité Directivo** — trimestrales a partir del otoño de 2026.',
        },
      },
      contact: {
        title: 'Contacte al equipo del Plan de Mejora de la Salud Comunitaria',
        email: 'Correo electrónico:',
        emailToBeAdded: 'Correo electrónico por agregar',
        phone: 'Teléfono:',
        web: 'Web:',
      },
    },
  },

  // Priority area page
  priorityArea: {
    notFound: {
      title: 'Área prioritaria no encontrada',
      message: 'No pudimos encontrar un área prioritaria que coincida con "{id}".',
    },
    goal: 'Meta:',
    focusedOn: 'Enfocado en:',
    implementationWindow: 'Período de implementación:',
    objective: 'Objetivo {number}',
    dataSource: 'Fuente de datos:',
    reportingFrequency: 'Frecuencia de informes:',
    stateComparison: 'Comparación estatal:',
    strategy: 'Estrategia',
    intendedOutcome: 'Resultado esperado',
    annualMilestones: 'Hitos anuales',
    milestonesSubtitle: 'Indicadores de proceso a corto plazo rastreados cada año.',
    partnersTitle: 'Socios',
    evaluationMeasures: 'Más detalles: medidas de evaluación',
  },

  // Priority card
  priorityCard: {
    goal: 'Meta',
    seeFullDetails: 'Ver detalles completos',
    ariaLabel: 'Ver detalles completos para {priority}',
  },

  // Progress bar
  progressBar: {
    baseline: 'Línea base',
    target: 'Meta',
    current: 'Actual:',
    trackingToBegin: 'Línea base establecida — seguimiento por comenzar. El progreso aparecerá aquí una vez que se reporten nuevas mediciones.',
    progressLabel: '{metric}: {percent}% del camino de {baseline} a {target}',
    ofTheWayToTarget: '{percent}% del camino a la meta',
    decreaseGoal: ', meta de disminución',
  },

  // Milestones
  milestones: {
    noMilestones: 'Aún no hay hitos definidos.',
    target: 'Meta:',
    reports: 'Informes {frequency}',
    baseline: 'Línea base:',
    source: 'Fuente:',
    status: {
      complete: 'Completado',
      in_progress: 'En progreso',
      not_started: 'No iniciado',
      unknown: 'Desconocido',
    },
  },

  // Partner list
  partnerList: {
    noPartners: 'No hay socios listados.',
    noneListed: 'Ninguno listado.',
    leadPartners: 'Socios líderes',
    leadDescription: 'Tiempo del personal e implementación diaria.',
    advisoryPartners: 'Socios asesores',
    advisoryDescription: 'Orientación, apoyo y coordinación.',
    lastActivity: 'Última actividad:',
    activityStatusTitle: 'Estado de actividad del socio (etiqueta de formato libre definida por el Departamento de Salud del Condado de Orange)',
    statusNotSet: 'estado no establecido',
  },

  // Footer
  footer: {
    contact: 'Contacto',
    contactToBeAdded: 'Información de contacto por agregar',
    reportsAssessments: 'Informes y Evaluaciones',
    data: 'Datos',
    lastUpdated: 'Última actualización:',
    version: 'Versión',
    disclaimer: 'Este panel se proporciona para transparencia pública. Los porcentajes y hitos reflejan el Plan de Mejora de la Salud Comunitaria tal como fue presentado al Departamento de Salud del Estado de Nueva York.',
  },

  // Date formatting
  dates: {
    locale: 'es-ES',
  },
};
