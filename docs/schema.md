# CHIP Dashboard Data Schema

The entire dashboard reads a single JSON file: `src/data/chip-data.json`.
This document explains the shape of that file so future maintainers can edit it
confidently. The Excel template in `template/` mirrors this schema 1:1, so if
you prefer editing a spreadsheet you can regenerate the JSON with
`npm run data:build`.

## Design goals

1. **One consistent shape per priority area.** Every priority area has the same
   fields, so the app is reusable for future CHIP cycles and for other counties.
2. **Explicit "not tracked yet" state.** Objectives support an optional
   `currentValue` that may be `null` when data collection hasn't begun; the app
   renders a neutral "baseline established, tracking to begin" state rather
   than a misleading progress bar.
3. **No hidden business logic in the schema.** Partner engagement is captured
   with a free-form `activityStatus` string. The app displays whatever the
   string says. OCDOH will define the meaning of values like "active" later;
   the schema and code intentionally do not interpret them.

## Top-level structure

```jsonc
{
  "meta":          { /* plan-wide metadata */ },
  "priorityAreas": [ /* array of priority-area objects, see below */ ]
}
```

### `meta`

| Field         | Type   | Required | Notes                                                                                       |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------- |
| `county`      | string | yes      | e.g. `"Orange County, NY"`                                                                  |
| `plan`        | string | yes      | e.g. `"2025–2030 Community Health Improvement Plan"`                                        |
| `publishedBy` | string | yes      | Publishing agency, e.g. `"Orange County Department of Health"`                              |
| `lastUpdated` | string | yes      | ISO date (`YYYY-MM-DD`). Shown in the site footer.                                          |
| `version`     | string | yes      | Data version, incremented when the JSON changes materially.                                 |
| `contact`     | object | yes      | `{ email, phone, url }`. Empty strings allowed.                                             |
| `notes`       | string | no       | Free-form notes shown in the Data & Methodology page. Use this to document data caveats.    |

### `priorityAreas[]`

Each priority area has the same shape.

| Field                   | Type            | Required | Notes                                                                                                          |
| ----------------------- | --------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `id`                    | string          | yes      | Slug used in URLs. Lowercase, hyphenated (e.g. `nutrition-security`).                                          |
| `domain`                | string          | yes      | NYSDOH Prevention Agenda domain (e.g. `"Economic Stability"`).                                                 |
| `priority`              | string          | yes      | Priority area name (e.g. `"Nutrition Security"`).                                                              |
| `goal`                  | string          | yes      | Short plain-language goal (e.g. `"Increase Food Security"`).                                                   |
| `disparityAddressed`    | string          | yes      | The population being prioritized (e.g. `"Individuals with low socioeconomic status (SES)"`).                   |
| `timeframe`             | object          | yes      | `{ start, end }` — ISO dates for the priority area's implementation window.                                    |
| `evidenceBasedStrategy` | string          | yes      | Multi-sentence description of the strategy from the CHIP.                                                      |
| `objective`             | object          | yes      | See `objective` below.                                                                                         |
| `evaluationMeasures`    | string[]        | yes      | Array of measurement labels (e.g. `"# of screening events"`).                                                  |
| `outcome`               | string          | yes      | The intended result (e.g. `"Increased number of adults able to receive colorectal cancer screenings"`).        |
| `milestones`            | milestone[]     | yes      | Ordered short-term process indicators. May be empty.                                                           |
| `partners`              | partner[]       | yes      | All partners for this priority area (lead + advisory).                                                         |

### `objective`

The objective and the "long-term outcome indicator" from the CHIP grid restate
the same numbers, so they are merged into a single object here to avoid drift.

| Field                | Type          | Required | Notes                                                                                                      |
| -------------------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `number`             | string        | yes      | Objective number from the CHIP (e.g. `"3.1"`, `"5.1"`, `"33.0"`).                                          |
| `description`        | string        | yes      | The full sentence as written in the CHIP.                                                                  |
| `metric`             | string        | yes      | Short label for the number being tracked (e.g. `"Food security among adults earning <$25,000"`).           |
| `unit`               | string        | yes      | Unit of the values (`"percent"`, `"count"`, etc.).                                                         |
| `baseline`           | `{value,year}`| yes      | Starting value and the year it was measured.                                                               |
| `target`             | `{value,year}`| yes      | End-of-plan target value and its year.                                                                     |
| `currentValue`       | number \| null| yes      | Most recent measurement; `null` when tracking hasn't begun. The UI treats `null` as "tracking to begin".   |
| `dataSource`         | string        | yes      | Where the baseline/current values come from.                                                               |
| `reportingFrequency` | string        | yes      | How often the value is refreshed (`"Yearly"`, `"Every 3 years"`, `"Every 4 years"`, etc.).                 |
| `stateComparison`    | object \| null| no       | `{ value, label }` for the NYSDOH Prevention Agenda comparison. `null` if not applicable.                  |

### `milestone`

| Field         | Type    | Required | Notes                                                                                                                            |
| ------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | string  | yes      | Unique within the priority area (e.g. `"3.1-m1"`).                                                                               |
| `description` | string  | yes      | The activity/milestone as written.                                                                                               |
| `targetDate`  | string  | yes      | ISO date (`YYYY-MM-DD`). Milestones stated as "By December 2026" use `2026-12-31`; "By June 2028" uses `2028-06-30`.             |
| `baseline`    | string  | yes      | Free-form (e.g. `"Zero"`, `"None"`, `"To be determined December 31, 2026"`, `"200 (3-year average 2024-YTD 2026)"`).              |
| `dataSource`  | string  | yes      | Where progress is measured from.                                                                                                 |
| `frequency`   | string  | yes      | How often it's reported (`"Once"`, `"Quarterly"`, etc.).                                                                         |
| `status`      | enum    | yes      | One of `"not_started"`, `"in_progress"`, `"complete"`. Strict — the converter rejects other values.                              |

### `partner`

| Field              | Type          | Required | Notes                                                                                                                                  |
| ------------------ | ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | string        | yes      | Full organization name.                                                                                                                |
| `shortName`        | string \| null| no       | Acronym or short name if any (e.g. `"OCDOH"`).                                                                                         |
| `role`             | enum          | yes      | One of `"lead"` or `"advisory"`. Strict.                                                                                               |
| `activityStatus`   | string        | yes      | **Free-form string. Displayed verbatim in the UI. No code interprets it.** OCDOH will later decide what values like "active" mean.     |
| `lastActivityDate` | string \| null| no       | ISO date of the partner's last recorded activity, if tracked.                                                                          |
| `notes`            | string \| null| no       | Any other detail worth showing on the partner page.                                                                                    |

## Enums (strict values)

- `milestone.status` ∈ `{ "not_started", "in_progress", "complete" }`
- `partner.role` ∈ `{ "lead", "advisory" }`

Anything else is a validation error at import time and the converter exits
non-zero with a clear message. All other free-form fields (including
`activityStatus`) are open strings.
