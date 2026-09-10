#!/usr/bin/env node
/**
 * generate-template.js
 *
 * Generates two Excel workbooks:
 *   1. template/chip-template.xlsx  — blank, with header row + a hint row.
 *   2. template/chip-sample.xlsx    — filled in with the current chip-data.json.
 *
 * Run this whenever the schema (columns) changes so partners can start from
 * an up-to-date template.
 *
 *   node scripts/generate-template.js
 */

import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const DATA = path.join(repoRoot, 'src', 'data', 'chip-data.json');
const TEMPLATE_OUT = path.join(repoRoot, 'template', 'chip-template.xlsx');
const SAMPLE_OUT = path.join(repoRoot, 'template', 'chip-sample.xlsx');

const META_COLS = ['key', 'value'];

const PRIORITY_COLS = [
  'priorityId',
  'domain',
  'priority',
  'goal',
  'disparityAddressed',
  'timeframeStart',
  'timeframeEnd',
  'evidenceBasedStrategy',
  'outcome',
  'evaluationMeasures',
  'objectiveNumber',
  'objectiveDescription',
  'metric',
  'unit',
  'baselineValue',
  'baselineYear',
  'targetValue',
  'targetYear',
  'currentValue',
  'dataSource',
  'reportingFrequency',
  'stateComparisonValue',
  'stateComparisonLabel',
];

const MILESTONE_COLS = [
  'milestoneId',
  'priorityId',
  'description',
  'targetDate',
  'baseline',
  'dataSource',
  'frequency',
  'status',
];

const PARTNER_COLS = [
  'priorityId',
  'name',
  'shortName',
  'role',
  'activityStatus',
  'lastActivityDate',
  'notes',
];

// Rows whose first column starts with `#` are treated as help/hint rows and
// skipped by the converter. Use them for column explanations.
const HINTS = {
  Meta: {
    key: '# example',
    value: 'Fill in county, plan, publishedBy, lastUpdated (YYYY-MM-DD), version, contactEmail, contactPhone, contactUrl, notes',
  },
  Priorities: {
    priorityId: '# example',
    domain: 'Economic Stability',
    priority: 'Nutrition Security',
    goal: 'Increase Food Security',
    disparityAddressed: 'Individuals with low SES',
    timeframeStart: '2026-07-01',
    timeframeEnd: '2030-12-31',
    evidenceBasedStrategy: 'One paragraph describing the strategy',
    outcome: 'What success looks like in plain language',
    evaluationMeasures: 'measure 1 ; measure 2 ; measure 3',
    objectiveNumber: '3.1',
    objectiveDescription: 'The full sentence from the CHIP',
    metric: 'What is being measured',
    unit: 'percent',
    baselineValue: 78,
    baselineYear: 2024,
    targetValue: 81.9,
    targetYear: 2030,
    currentValue: '',
    dataSource: 'Orange County Community Health Survey, 2024',
    reportingFrequency: 'Every 3 years',
    stateComparisonValue: 51.1,
    stateComparisonLabel: 'NYSDOH Prevention Agenda',
  },
  Milestones: {
    milestoneId: '# example',
    priorityId: 'nutrition-security',
    description: 'Establish a baseline of CBOs currently screening for food security',
    targetDate: '2026-12-31',
    baseline: 'None',
    dataSource: 'CHIP evaluation database',
    frequency: 'Once',
    status: 'not_started  (allowed: not_started | in_progress | complete)',
  },
  Partners: {
    priorityId: '# example',
    name: 'Orange County Department of Health',
    shortName: 'OCDOH',
    role: 'lead  (allowed: lead | advisory)',
    activityStatus: 'named_only  (free-form; app displays as-is)',
    lastActivityDate: '',
    notes: '',
  },
};

function makeSheet(headers, rows) {
  // rows is an array of objects keyed by header name.
  const aoa = [headers];
  for (const row of rows) {
    aoa.push(headers.map((h) => (row[h] === undefined || row[h] === null ? '' : row[h])));
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Set reasonable column widths.
  ws['!cols'] = headers.map((h) => ({ wch: Math.max(14, Math.min(48, h.length + 4)) }));
  // Freeze the header row.
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  return ws;
}

function buildBlankWorkbook() {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, makeSheet(META_COLS, [HINTS.Meta]), 'Meta');
  XLSX.utils.book_append_sheet(wb, makeSheet(PRIORITY_COLS, [HINTS.Priorities]), 'Priorities');
  XLSX.utils.book_append_sheet(wb, makeSheet(MILESTONE_COLS, [HINTS.Milestones]), 'Milestones');
  XLSX.utils.book_append_sheet(wb, makeSheet(PARTNER_COLS, [HINTS.Partners]), 'Partners');
  return wb;
}

function buildSampleWorkbook(data) {
  const wb = XLSX.utils.book_new();

  const metaRows = [
    { key: 'county', value: data.meta.county },
    { key: 'plan', value: data.meta.plan },
    { key: 'publishedBy', value: data.meta.publishedBy },
    { key: 'lastUpdated', value: data.meta.lastUpdated },
    { key: 'version', value: data.meta.version },
    { key: 'contactEmail', value: data.meta.contact.email || '' },
    { key: 'contactPhone', value: data.meta.contact.phone || '' },
    { key: 'contactUrl', value: data.meta.contact.url || '' },
    { key: 'notes', value: data.meta.notes || '' },
  ];
  XLSX.utils.book_append_sheet(wb, makeSheet(META_COLS, metaRows), 'Meta');

  const priorityRows = data.priorityAreas.map((p) => ({
    priorityId: p.id,
    domain: p.domain,
    priority: p.priority,
    goal: p.goal,
    disparityAddressed: p.disparityAddressed,
    timeframeStart: p.timeframe.start,
    timeframeEnd: p.timeframe.end,
    evidenceBasedStrategy: p.evidenceBasedStrategy,
    outcome: p.outcome,
    evaluationMeasures: p.evaluationMeasures.join(' ; '),
    objectiveNumber: p.objective.number,
    objectiveDescription: p.objective.description,
    metric: p.objective.metric,
    unit: p.objective.unit,
    baselineValue: p.objective.baseline.value,
    baselineYear: p.objective.baseline.year,
    targetValue: p.objective.target.value,
    targetYear: p.objective.target.year,
    currentValue: p.objective.currentValue ?? '',
    dataSource: p.objective.dataSource,
    reportingFrequency: p.objective.reportingFrequency,
    stateComparisonValue: p.objective.stateComparison ? p.objective.stateComparison.value : '',
    stateComparisonLabel: p.objective.stateComparison ? p.objective.stateComparison.label : '',
  }));
  XLSX.utils.book_append_sheet(wb, makeSheet(PRIORITY_COLS, priorityRows), 'Priorities');

  const milestoneRows = [];
  for (const p of data.priorityAreas) {
    for (const m of p.milestones) {
      milestoneRows.push({
        milestoneId: m.id,
        priorityId: p.id,
        description: m.description,
        targetDate: m.targetDate,
        baseline: m.baseline,
        dataSource: m.dataSource,
        frequency: m.frequency,
        status: m.status,
      });
    }
  }
  XLSX.utils.book_append_sheet(wb, makeSheet(MILESTONE_COLS, milestoneRows), 'Milestones');

  const partnerRows = [];
  for (const p of data.priorityAreas) {
    for (const partner of p.partners) {
      partnerRows.push({
        priorityId: p.id,
        name: partner.name,
        shortName: partner.shortName ?? '',
        role: partner.role,
        activityStatus: partner.activityStatus,
        lastActivityDate: partner.lastActivityDate ?? '',
        notes: partner.notes ?? '',
      });
    }
  }
  XLSX.utils.book_append_sheet(wb, makeSheet(PARTNER_COLS, partnerRows), 'Partners');

  return wb;
}

function main() {
  fs.mkdirSync(path.dirname(TEMPLATE_OUT), { recursive: true });
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));

  // Use write() to a buffer and fs.writeFileSync so we don't depend on
  // SheetJS's Node fs bridge (not wired up in the ESM build by default).
  fs.writeFileSync(
    TEMPLATE_OUT,
    XLSX.write(buildBlankWorkbook(), { type: 'buffer', bookType: 'xlsx' })
  );
  console.log(`Wrote:   ${path.relative(repoRoot, TEMPLATE_OUT)}`);

  fs.writeFileSync(
    SAMPLE_OUT,
    XLSX.write(buildSampleWorkbook(data), { type: 'buffer', bookType: 'xlsx' })
  );
  console.log(`Wrote:   ${path.relative(repoRoot, SAMPLE_OUT)}`);
}

main();
