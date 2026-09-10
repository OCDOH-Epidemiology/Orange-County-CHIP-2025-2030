/**
 * English (en) locale — UI chrome and static page content.
 * This is the default/fallback language.
 */
export default {
  // Language metadata
  meta: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },

  // Navigation
  nav: {
    overview: 'Overview',
    timeline: 'Timeline',
    partners: 'Partners',
    dataMethodology: 'Data & Methodology',
    getInvolved: 'Get Involved',
    toggleMenu: 'Toggle navigation',
    skipToMain: 'Skip to main content',
  },

  // Language switcher
  languageSwitcher: {
    label: 'Language',
    switchTo: 'Español',
    currentLanguage: 'Current language: English',
    changeLanguage: 'Change language',
  },

  // Common UI elements
  common: {
    backToOverview: 'Back to overview',
    seeFullDetails: 'See full details',
    opensInNewTab: '(opens in new tab)',
    loading: 'Loading…',
    error: 'Error',
    notFound: 'Not found',
    showMore: 'Show more',
    showLess: 'Show less',
  },

  // Document titles (used with useDocumentTitle)
  titles: {
    overview: 'Overview',
    timeline: 'Timeline',
    partners: 'Partner Directory',
    dataMethodology: 'Data & Methodology',
    getInvolved: 'Get Involved',
    priorityNotFound: 'Priority Area Not Found',
    baseTitle: 'Orange County CHIP Dashboard',
  },

  // Breadcrumbs
  breadcrumbs: {
    overview: 'Overview',
    timeline: 'Timeline',
    partners: 'Partners',
    dataMethodology: 'Data & Methodology',
    getInvolved: 'Get Involved',
  },

  // Landing page
  landing: {
    tagline: 'Community Health Improvement Plan • 2025–2030',
    title: "Tracking Orange County's public health priorities.",
    intro: 'A Community Health Improvement Plan is a five-year, public roadmap for improving the health of a community. It identifies the most pressing health needs, sets measurable goals, and names the partners doing the work. This dashboard shows what Orange County is working on and how it is going.',
    howDataWorks: 'How the data works',
    getInvolved: 'Get involved',
    priorityAreasTitle: 'The three priority areas',
    priorityAreasIntro: 'Each priority area addresses a specific health disparity in Orange County. Click any card for milestones, partners, and the strategy being used.',
    exploreTitle: 'Explore the plan',
    tiles: {
      timeline: {
        title: 'Timeline',
        body: 'See every milestone from 2026 through 2030 on one chronological view.',
      },
      partners: {
        title: 'Partner directory',
        body: 'All lead and advisory partners across the three priority areas.',
      },
      methodology: {
        title: 'Data & methodology',
        body: 'Data sources, survey years, and what the numbers actually mean.',
      },
      getInvolved: {
        title: 'Get involved',
        body: 'How residents and organizations can join a workgroup or share feedback.',
      },
    },
  },

  // Timeline page
  timeline: {
    title: 'Timeline: 2026 – 2030',
    intro: 'Every milestone across the three Community Health Improvement Plan priority areas, in the order it is scheduled to be completed. Colored dots identify which priority area a milestone belongs to.',
    legendLabel: 'Priority area legend',
  },

  // Partners page
  partners: {
    title: 'Partner directory',
    intro: '{count} organizations are named across the three Community Health Improvement Plan priority areas as lead or advisory partners.',
    filters: {
      priorityArea: 'Priority area',
      allPriorityAreas: 'All priority areas',
      role: 'Role',
      leadAndAdvisory: 'Lead and advisory',
      leadOnly: 'Lead only',
      advisoryOnly: 'Advisory only',
      search: 'Search',
      searchPlaceholder: 'Organization name…',
    },
    showingResults: 'Showing {filtered} of {total} partner assignments.',
    tableHeaders: {
      organization: 'Organization',
      priorityArea: 'Priority area',
      role: 'Role',
      activityStatus: 'Activity status',
    },
    noMatches: 'No partners match those filters.',
    statusNotSet: 'status not set',
  },

  // Data & Methodology page
  methodology: {
    title: 'Data & Methodology',
    intro: 'How the numbers on this dashboard are produced and what they mean.',
    sections: {
      whatIsCHIP: {
        title: 'What is a Community Health Improvement Plan?',
        content: [
          'A Community Health Improvement Plan is a five-year public health strategy required by New York State. It identifies the most pressing health issues in a county, chooses a small number of priorities that the local health department and its partners can realistically move, and commits to measurable objectives with annual milestones.',
          "Orange County's 2025–2030 Community Health Improvement Plan was developed using the Mobilizing for Action through Planning and Partnerships framework. Priorities were chosen through community surveys, partner voting at the Orange County Health Summit, and a health-and-human-services provider survey, alongside quantitative data from the Community Health Assessment.",
        ],
      },
      dataSources: {
        title: 'Where the numbers come from',
        intro: "Each priority area's objective has a specific data source and reporting frequency:",
        reported: 'reported {frequency}',
        uniqueSources: 'Unique data sources across the plan:',
      },
      progressBars: {
        title: 'How to read the progress bars',
        content: [
          'Each objective has three numbers: a **baseline** (the starting measurement), a **target** (where the Orange County Department of Health aims to be by 2030), and a **current value** (the most recent measurement).',
          'Some objectives use **increase goals** (e.g. more adults screened for colorectal cancer) and some use **decrease goals** (e.g. fewer adults reporting mental distress). The progress bar always fills toward the target, so a fuller bar always means better performance regardless of direction.',
          'Where you see "baseline established, tracking to begin," a new measurement has not yet been collected. This is expected in the first years of a five-year plan and is not a data gap; the dashboard will start showing progress once the next survey or administrative dataset arrives.',
        ],
      },
      milestoneStatus: {
        title: 'Milestone status',
        intro: 'Each annual milestone has one of three statuses:',
        statuses: {
          notStarted: '**Not started** — the milestone is scheduled but work has not yet begun.',
          inProgress: '**In progress** — work is underway and being tracked in the Community Health Improvement Plan evaluation database.',
          complete: '**Complete** — the milestone target has been reached.',
        },
      },
      partnerActivity: {
        title: 'A note on partner activity',
        content: 'Every partner shown in the dashboard has a small "activity status" label next to their name. These labels are set by Orange County Department of Health staff and describe the partner\'s current involvement in the workgroup for that priority area. The exact criteria for what counts as "active" versus "engaged" are being defined by the Orange County Department of Health — the dashboard displays whatever the label says without inferring meaning.',
      },
      dataNotes: {
        title: 'Data notes',
      },
      limitations: {
        title: 'Limitations',
        items: [
          'Long-term objectives are refreshed by survey; the Orange County Community Health Survey is conducted roughly every three years, and the New York State Behavioral Risk Factor Surveillance Survey is refreshed on a state cycle. Between surveys, only the short-term process indicators change.',
          "Milestone status reflects the Orange County Department of Health's most recent workgroup review. Data is updated quarterly during Steering Committee meetings.",
          'The Community Health Improvement Plan addresses only three priority areas by design; other important issues in Orange County are addressed by separate coalitions, plans, and county departments referenced in the plan narrative.',
        ],
      },
    },
  },

  // Get Involved page
  getInvolved: {
    title: 'Get involved',
    intro: "Orange County's health improves when residents, workers, and organizations partner with the health department. Here are three ways you can help move the Community Health Improvement Plan forward.",
    sections: {
      joinWorkgroup: {
        title: 'Join a priority-area workgroup',
        content: 'Each priority area has a workgroup led by the Orange County Department of Health that meets monthly or quarterly. Workgroups plan events, review data, and coordinate partner activity. Anyone with lived experience, professional expertise, or community reach in these topics is welcome to participate.',
      },
      shareExperience: {
        title: 'Share your experience',
        content: [
          'The Community Health Improvement Plan was built on more than 2,200 resident voices through the Orange County Community Health Survey, focus groups with underrepresented community members, and key informant interviews. The Orange County Department of Health continues to collect community input year-round.',
          "If you'd like to share your experience with food security, mental health, or preventive care access in Orange County, reach out through the contact information below.",
        ],
      },
      attendUpdate: {
        title: 'Attend a public update',
        intro: 'Progress on the Community Health Improvement Plan is shared publicly at:',
        events: {
          miniSummits: '**Annual Mini-Summits** — priority-specific updates, one per priority area each year.',
          healthSummit: '**Orange County Health Summit** — a biennial gathering starting in 2027 with all three workgroups and the Steering Committee.',
          steeringCommittee: '**Steering Committee meetings** — quarterly starting fall 2026.',
        },
      },
      contact: {
        title: 'Contact the Community Health Improvement Plan team',
        email: 'Email:',
        emailToBeAdded: 'Email to be added',
        phone: 'Phone:',
        web: 'Web:',
      },
    },
  },

  // Priority area page
  priorityArea: {
    notFound: {
      title: 'Priority area not found',
      message: 'We couldn\'t find a priority area matching "{id}".',
    },
    goal: 'Goal:',
    focusedOn: 'Focused on:',
    implementationWindow: 'Implementation window:',
    objective: 'Objective {number}',
    dataSource: 'Data source:',
    reportingFrequency: 'Reporting frequency:',
    stateComparison: 'State comparison:',
    strategy: 'Strategy',
    intendedOutcome: 'Intended outcome',
    annualMilestones: 'Annual milestones',
    milestonesSubtitle: 'Short-term process indicators tracked each year.',
    partnersTitle: 'Partners',
    evaluationMeasures: 'More detail: evaluation measures',
  },

  // Priority card
  priorityCard: {
    goal: 'Goal',
    seeFullDetails: 'See full details',
    ariaLabel: 'See full details for {priority}',
  },

  // Progress bar
  progressBar: {
    baseline: 'Baseline',
    target: 'Target',
    current: 'Current:',
    trackingToBegin: 'Baseline established — tracking to begin. Progress will appear here once new measurements are reported.',
    progressLabel: '{metric}: {percent}% of the way from {baseline} to {target}',
    ofTheWayToTarget: '{percent}% of the way to target',
    decreaseGoal: ', decrease goal',
  },

  // Milestones
  milestones: {
    noMilestones: 'No milestones defined yet.',
    target: 'Target:',
    reports: 'Reports {frequency}',
    baseline: 'Baseline:',
    source: 'Source:',
    status: {
      complete: 'Complete',
      in_progress: 'In progress',
      not_started: 'Not started',
      unknown: 'Unknown',
    },
  },

  // Partner list
  partnerList: {
    noPartners: 'No partners listed.',
    noneListed: 'None listed.',
    leadPartners: 'Lead partners',
    leadDescription: 'Staff time and day-to-day implementation.',
    advisoryPartners: 'Advisory partners',
    advisoryDescription: 'Guidance, support, and coordination.',
    lastActivity: 'Last activity:',
    activityStatusTitle: 'Partner activity status (free-form label defined by the Orange County Department of Health)',
    statusNotSet: 'status not set',
  },

  // Footer
  footer: {
    contact: 'Contact',
    contactToBeAdded: 'Contact info to be added',
    reportsAssessments: 'Reports & Assessments',
    data: 'Data',
    lastUpdated: 'Last updated:',
    version: 'Version',
    disclaimer: 'This dashboard is provided for public transparency. Percentages and milestones reflect the Community Health Improvement Plan as submitted to the New York State Department of Health.',
  },

  // Date formatting
  dates: {
    locale: 'en-US',
  },
};
