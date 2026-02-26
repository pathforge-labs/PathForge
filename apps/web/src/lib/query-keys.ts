/**
 * PathForge — Query Keys Factory
 * =================================
 * Centralized, typed query key factory for TanStack Query.
 *
 * Conventions:
 * - Each domain has a top-level `all` key for invalidation
 * - Function keys return tuples for specificity
 * - Keys are ordered: domain → scope → params
 */

export const queryKeys = {
  // ── Health ────────────────────────────────────────────
  health: {
    all: ["health"] as const,
    check: () => ["health", "check"] as const,
    ready: () => ["health", "ready"] as const,
  },

  // ── Users ─────────────────────────────────────────────
  users: {
    all: ["users"] as const,
    me: () => ["users", "me"] as const,
  },

  // ── Career DNA ────────────────────────────────────────
  careerDna: {
    all: ["career-dna"] as const,
    profile: () => ["career-dna", "profile"] as const,
    summary: () => ["career-dna", "summary"] as const,
    skillGenome: () => ["career-dna", "skill-genome"] as const,
    experienceBlueprint: () => ["career-dna", "experience-blueprint"] as const,
    growthVector: () => ["career-dna", "growth-vector"] as const,
    valuesProfile: () => ["career-dna", "values-profile"] as const,
    marketPosition: () => ["career-dna", "market-position"] as const,
  },

  // ── Threat Radar ──────────────────────────────────────
  threatRadar: {
    all: ["threat-radar"] as const,
    overview: () => ["threat-radar", "overview"] as const,
    automationRisk: () => ["threat-radar", "automation-risk"] as const,
    skillsShield: () => ["threat-radar", "skills-shield"] as const,
    resilience: () => ["threat-radar", "resilience"] as const,
    alerts: (page?: number, status?: string) =>
      ["threat-radar", "alerts", { page, status }] as const,
    preferences: () => ["threat-radar", "preferences"] as const,
  },

  // ── Command Center ────────────────────────────────────
  commandCenter: {
    all: ["command-center"] as const,
    dashboard: () => ["command-center", "dashboard"] as const,
    healthSummary: () => ["command-center", "health-summary"] as const,
    engine: (name: string) => ["command-center", "engine", name] as const,
    preferences: () => ["command-center", "preferences"] as const,
  },

  // ── Notifications ─────────────────────────────────────
  notifications: {
    all: ["notifications"] as const,
    list: (page?: number, filters?: Record<string, unknown>) =>
      ["notifications", "list", { page, ...filters }] as const,
    unreadCount: () => ["notifications", "unread-count"] as const,
    digests: (page?: number) => ["notifications", "digests", { page }] as const,
    preferences: () => ["notifications", "preferences"] as const,
  },

  // ── User Profile ──────────────────────────────────────
  userProfile: {
    all: ["user-profile"] as const,
    profile: () => ["user-profile", "profile"] as const,
    onboarding: () => ["user-profile", "onboarding"] as const,
    dataSummary: () => ["user-profile", "data-summary"] as const,
    exports: (page?: number) => ["user-profile", "exports", { page }] as const,
    exportStatus: (id: string) => ["user-profile", "export", id] as const,
  },

  // ── Applications ──────────────────────────────────────
  applications: {
    all: ["applications"] as const,
    list: (page?: number, status?: string) =>
      ["applications", "list", { page, status }] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
  },

  // ── Analytics ─────────────────────────────────────────
  analytics: {
    all: ["analytics"] as const,
    funnel: (period?: string) => ["analytics", "funnel", { period }] as const,
    timeline: (days?: number) => ["analytics", "timeline", { days }] as const,
    insights: () => ["analytics", "insights"] as const,
    experiments: () => ["analytics", "experiments"] as const,
  },

  // ── Blacklist ─────────────────────────────────────────
  blacklist: {
    all: ["blacklist"] as const,
    list: () => ["blacklist", "list"] as const,
  },

  // ── AI Engine ─────────────────────────────────────────
  ai: {
    all: ["ai"] as const,
  },

  // ── Sprint 27: Intelligence Hub ───────────────────────

  // ── Skill Decay & Growth Tracker ──────────────────────
  skillDecay: {
    all: ["skill-decay"] as const,
    dashboard: () => ["skill-decay", "dashboard"] as const,
    freshness: () => ["skill-decay", "freshness"] as const,
    marketDemand: () => ["skill-decay", "market-demand"] as const,
    velocityMap: () => ["skill-decay", "velocity-map"] as const,
    reskillingPathways: () => ["skill-decay", "reskilling-pathways"] as const,
    preferences: () => ["skill-decay", "preferences"] as const,
  },

  // ── Salary Intelligence Engine™ ───────────────────────
  salaryIntelligence: {
    all: ["salary-intelligence"] as const,
    dashboard: () => ["salary-intelligence", "dashboard"] as const,
    estimate: () => ["salary-intelligence", "estimate"] as const,
    skillImpacts: () => ["salary-intelligence", "skill-impacts"] as const,
    trajectory: () => ["salary-intelligence", "trajectory"] as const,
    scenarios: () => ["salary-intelligence", "scenarios"] as const,
    scenario: (id: string) => ["salary-intelligence", "scenario", id] as const,
    preferences: () => ["salary-intelligence", "preferences"] as const,
  },

  // ── Career Simulation Engine™ ─────────────────────────
  careerSimulation: {
    all: ["career-simulation"] as const,
    dashboard: (page?: number) => ["career-simulation", "dashboard", { page }] as const,
    detail: (id: string) => ["career-simulation", "detail", id] as const,
    preferences: () => ["career-simulation", "preferences"] as const,
  },

  // ── Transition Pathways ───────────────────────────────
  transitionPathways: {
    all: ["transition-pathways"] as const,
    dashboard: () => ["transition-pathways", "dashboard"] as const,
    list: () => ["transition-pathways", "list"] as const,
    detail: (id: string) => ["transition-pathways", "detail", id] as const,
    skillBridge: (id: string) => ["transition-pathways", "skill-bridge", id] as const,
    milestones: (id: string) => ["transition-pathways", "milestones", id] as const,
    preferences: () => ["transition-pathways", "preferences"] as const,
  },
} as const;
