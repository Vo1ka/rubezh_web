// RW-15 thresholds. Starting values from the spec; the team confirms the final
// numbers after the first two weeks of use.
export const STALENESS = {
  /** «Статус отстал от кода»: more unaccounted commits than this… */
  maxUnaccountedCommits: 5,
  /** …or the oldest unaccounted commit is older than this many days. */
  maxUnaccountedDays: 3,
  /** «Статус давно не обновлялся»: `updated` older than this many days. */
  maxStatusAgeDays: 14,
  /** How many registry revisions to look back for an owner change. */
  registryHistoryDepth: 20,
} as const;

/** Commits touching only these paths don't make a STATUS stale (it's the team's own notes). */
export const IGNORED_COMMIT_PATHS = /^directions\//;
