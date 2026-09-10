#!/usr/bin/env node
/**
 * excel-to-json.js
 *
 * Reads a CHIP workbook (.xlsx) and writes src/data/chip-data.json.
 *
 * Usage:
 *   node scripts/excel-to-json.js [path/to/workbook.xlsx]
 *
 * Defaults to template/chip-sample.xlsx if no path is given.
 *
 * Workbook shape (4 sheets — see docs/schema.md for details):
 *   - Meta        (key/value)
 *   - Priorities  (one row per priority area)
 *   - Milestones  (one row per milestone, keyed by priorityId)
 *   - Partners    (one row per partner,  keyed by priorityId)
 *
 * On any validation error, prints a clear message with sheet + row and exits 1.
 */

import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const DEFAULT_INPUT = path.join(repoRoot, 'template', 'chip-sample.xlsx');
const OUTPUT = path.join(repoRoot, 'src', 'data', 'chip-data.json');

// Strict enums. Anything else is a validation error.
const MILESTONE_STATUSES = ['not_started', 'in_progress', 'complete'];
const PARTNER_ROLES = ['lead', 'advisory'];

const errors = [];
function err(sheet, row, message) {
  errors.push(`  • ${sheet} row ${row}: ${message}`);
}

function trim(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function optional(v) {
  const s = trim(v);
  return s === '' ? null : s;
}

function toNumber(v, sheet, row, column) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  if (Number.isNaN(n)) {
    err(sheet, row, `column "${column}" must be a number, got "${v}"`);
    return null;
  }
  return n;
}

function toRequiredNumber(v, sheet, row, column) {
  const n = toNumber(v, sheet, row, column);
  if (n === null) err(sheet, row, `column "${column}" is required`);
  return n;
}

/**
 * Excel stores dates as either a JS Date (when {cellDates:true}) or a serial
 * number. We accept a Date, an ISO date string, or any string XLSX can turn
 * into a JS Date via cell formatting. Output is always YYYY-MM-DD.
 */
function toISODate(v, sheet, row, column, { required = true } = {}) {
  if (v === '' || v === null || v === undefined) {
    if (required) err(sheet, row, `column "${column}" is a required date (YYYY-MM-DD)`);
    return null;
  }
  let d;
  if (v instanceof Date) {
    d = v;
  } else if (typeof v === 'number') {
    // Excel serial date
    const parsed = XLSX.SSF.parse_date_code(v);
    if (!parsed) {
      err(sheet, row, `column "${column}" is not a valid Excel date: ${v}`);
      return null;
    }
    d = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  } else {
    d = new Date(String(v));
    if (Number.isNaN(d.getTime())) {
      err(sheet, row, `column "${column}" is not a parseable date: "${v}" (use YYYY-MM-DD)`);
      return null;
    }
  }
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function requireField(v, sheet, row, column) {
  const s = trim(v);
  if (s === '') err(sheet, row, `column "${column}" is required`);
  return s;
}

function readSheet(wb, name) {
  const sheet = wb.Sheets[name];
  if (!sheet) {
    console.error(`\nMissing sheet: "${name}"\n`);
    process.exit(1);
  }
  // header:1 gives us [[header row], [row1], [row2], ...]
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: true,
    blankrows: false,
  });
  if (rows.length === 0) return { headers: [], records: [] };
  const headers = rows[0].map((h) => trim(h));
  const records = rows.slice(1).map((r, i) => {
    const obj = { __row: i + 2 }; // +2: header row is row 1, first data row is 2
    headers.forEach((h, idx) => {
      obj[h] = r[idx] === undefined ? '' : r[idx];
    });
    return obj;
  });
  return { headers, records };
}

function isHintRow(rec, keyColumn) {
  // Rows whose key column starts with `#` are treated as help/example rows.
  const v = trim(rec[keyColumn]);
  return v.startsWith('#');
}

function parseMeta(records) {
  const meta = {
    county: '',
    plan: '',
    publishedBy: '',
    lastUpdated: '',
    version: '',
    contact: { email: '', phone: '', url: '' },
    notes: '',
  };
  for (const r of records) {
    if (isHintRow(r, 'key')) continue;
    const key = trim(r.key);
    const value = trim(r.value);
    if (!key) continue;
    switch (key) {
      case 'county':       meta.county = value; break;
      case 'plan':         meta.plan = value; break;
      case 'publishedBy':  meta.publishedBy = value; break;
      case 'lastUpdated':  meta.lastUpdated = toISODate(r.value, 'Meta', r.__row, 'value') || ''; break;
      case 'version':      meta.version = value; break;
      case 'contactEmail': meta.contact.email = value; break;
      case 'contactPhone': meta.contact.phone = value; break;
      case 'contactUrl':   meta.contact.url = value; break;
      case 'notes':        meta.notes = value; break;
      default:
        err('Meta', r.__row, `unknown key "${key}"`);
    }
  }
  ['county', 'plan', 'publishedBy', 'lastUpdated', 'version'].forEach((f) => {
    if (!meta[f]) err('Meta', '?', `required key "${f}" is missing or blank`);
  });
  return meta;
}

function parsePriorities(records) {
  const priorities = [];
  const seenIds = new Set();
  for (const r of records) {
    if (isHintRow(r, 'priorityId')) continue;
    if (!trim(r.priorityId)) continue; // skip fully blank rows
    const row = r.__row;
    const id = requireField(r.priorityId, 'Priorities', row, 'priorityId');
    if (seenIds.has(id)) err('Priorities', row, `duplicate priorityId "${id}"`);
    seenIds.add(id);

    const priority = {
      id,
      domain: requireField(r.domain, 'Priorities', row, 'domain'),
      priority: requireField(r.priority, 'Priorities', row, 'priority'),
      goal: requireField(r.goal, 'Priorities', row, 'goal'),
      disparityAddressed: requireField(r.disparityAddressed, 'Priorities', row, 'disparityAddressed'),
      timeframe: {
        start: toISODate(r.timeframeStart, 'Priorities', row, 'timeframeStart'),
        end: toISODate(r.timeframeEnd, 'Priorities', row, 'timeframeEnd'),
      },
      evidenceBasedStrategy: requireField(r.evidenceBasedStrategy, 'Priorities', row, 'evidenceBasedStrategy'),
      objective: {
        number: requireField(r.objectiveNumber, 'Priorities', row, 'objectiveNumber'),
        description: requireField(r.objectiveDescription, 'Priorities', row, 'objectiveDescription'),
        metric: requireField(r.metric, 'Priorities', row, 'metric'),
        unit: requireField(r.unit, 'Priorities', row, 'unit'),
        baseline: {
          value: toRequiredNumber(r.baselineValue, 'Priorities', row, 'baselineValue'),
          year: toRequiredNumber(r.baselineYear, 'Priorities', row, 'baselineYear'),
        },
        target: {
          value: toRequiredNumber(r.targetValue, 'Priorities', row, 'targetValue'),
          year: toRequiredNumber(r.targetYear, 'Priorities', row, 'targetYear'),
        },
        currentValue: toNumber(r.currentValue, 'Priorities', row, 'currentValue'),
        dataSource: requireField(r.dataSource, 'Priorities', row, 'dataSource'),
        reportingFrequency: requireField(r.reportingFrequency, 'Priorities', row, 'reportingFrequency'),
        stateComparison:
          trim(r.stateComparisonValue) === '' && trim(r.stateComparisonLabel) === ''
            ? null
            : {
                value: toRequiredNumber(r.stateComparisonValue, 'Priorities', row, 'stateComparisonValue'),
                label: requireField(r.stateComparisonLabel, 'Priorities', row, 'stateComparisonLabel'),
              },
      },
      evaluationMeasures: trim(r.evaluationMeasures)
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean),
      outcome: requireField(r.outcome, 'Priorities', row, 'outcome'),
      milestones: [], // filled in later
      partners: [],   // filled in later
    };
    if (priority.evaluationMeasures.length === 0) {
      err('Priorities', row, 'evaluationMeasures must contain at least one entry (semicolon-separated)');
    }
    priorities.push(priority);
  }
  return priorities;
}

function parseMilestones(records, priorityMap) {
  const seenIds = new Set();
  for (const r of records) {
    if (isHintRow(r, 'milestoneId')) continue;
    if (!trim(r.milestoneId) && !trim(r.priorityId)) continue;
    const row = r.__row;
    const id = requireField(r.milestoneId, 'Milestones', row, 'milestoneId');
    const priorityId = requireField(r.priorityId, 'Milestones', row, 'priorityId');
    if (seenIds.has(id)) err('Milestones', row, `duplicate milestoneId "${id}"`);
    seenIds.add(id);
    const priority = priorityMap.get(priorityId);
    if (!priority) {
      err('Milestones', row, `priorityId "${priorityId}" not found in the Priorities sheet`);
      continue;
    }
    const status = trim(r.status).toLowerCase();
    if (!MILESTONE_STATUSES.includes(status)) {
      err(
        'Milestones',
        row,
        `status "${r.status}" not recognized — expected one of ${MILESTONE_STATUSES.join(', ')}`
      );
    }
    priority.milestones.push({
      id,
      description: requireField(r.description, 'Milestones', row, 'description'),
      targetDate: toISODate(r.targetDate, 'Milestones', row, 'targetDate'),
      baseline: trim(r.baseline),
      dataSource: requireField(r.dataSource, 'Milestones', row, 'dataSource'),
      frequency: requireField(r.frequency, 'Milestones', row, 'frequency'),
      status,
    });
  }
}

function parsePartners(records, priorityMap) {
  for (const r of records) {
    if (isHintRow(r, 'priorityId')) continue;
    if (!trim(r.priorityId) && !trim(r.name)) continue;
    const row = r.__row;
    const priorityId = requireField(r.priorityId, 'Partners', row, 'priorityId');
    const priority = priorityMap.get(priorityId);
    if (!priority) {
      err('Partners', row, `priorityId "${priorityId}" not found in the Priorities sheet`);
      continue;
    }
    const role = trim(r.role).toLowerCase();
    if (!PARTNER_ROLES.includes(role)) {
      err('Partners', row, `role "${r.role}" not recognized — expected one of ${PARTNER_ROLES.join(', ')}`);
    }
    priority.partners.push({
      name: requireField(r.name, 'Partners', row, 'name'),
      shortName: optional(r.shortName),
      role,
      // activityStatus is intentionally a free-form string. See docs/schema.md.
      // Do NOT add code that interprets specific values (e.g. "active").
      activityStatus: requireField(r.activityStatus, 'Partners', row, 'activityStatus'),
      lastActivityDate: toISODate(r.lastActivityDate, 'Partners', row, 'lastActivityDate', { required: false }),
      notes: optional(r.notes),
    });
  }
}

function main() {
  const input = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_INPUT;
  if (!fs.existsSync(input)) {
    console.error(`\nInput workbook not found: ${input}`);
    console.error(`Run \`npm run data:template\` to generate the blank template first.\n`);
    process.exit(1);
  }
  console.log(`Reading:  ${path.relative(repoRoot, input)}`);

  // Read via buffer so we don't rely on SheetJS's Node fs bridge, which
  // isn't wired up in the ESM build without XLSX.set_fs().
  const buf = fs.readFileSync(input);
  const wb = XLSX.read(buf, { cellDates: true, type: 'buffer' });

  const metaRecords = readSheet(wb, 'Meta').records;
  const priorityRecords = readSheet(wb, 'Priorities').records;
  const milestoneRecords = readSheet(wb, 'Milestones').records;
  const partnerRecords = readSheet(wb, 'Partners').records;

  const meta = parseMeta(metaRecords);
  const priorityAreas = parsePriorities(priorityRecords);
  const priorityMap = new Map(priorityAreas.map((p) => [p.id, p]));
  parseMilestones(milestoneRecords, priorityMap);
  parsePartners(partnerRecords, priorityMap);

  if (errors.length > 0) {
    console.error('\nValidation failed with the following errors:\n');
    errors.forEach((e) => console.error(e));
    console.error(`\n${errors.length} error(s). Fix the workbook and try again.\n`);
    process.exit(1);
  }

  // Sort milestones by targetDate within each priority so the timeline is stable.
  priorityAreas.forEach((p) => {
    p.milestones.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  });

  const out = { meta, priorityAreas };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + '\n', 'utf8');

  const totalMilestones = priorityAreas.reduce((n, p) => n + p.milestones.length, 0);
  const totalPartners = priorityAreas.reduce((n, p) => n + p.partners.length, 0);
  console.log(`Wrote:    ${path.relative(repoRoot, OUTPUT)}`);
  console.log(`Summary:  ${priorityAreas.length} priority areas, ${totalMilestones} milestones, ${totalPartners} partners.`);
}

main();
