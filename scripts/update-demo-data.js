#!/usr/bin/env node
/**
 * update-demo-data.js
 *
 * Updates chip-sample.xlsx with demo data for the Progression Measurement methodology:
 * 1. Clears currentValue (outcome values) — Activity Progress is the headline, not fake outcomes
 * 2. Sets milestone statuses to in_progress/complete for demo variety
 * 3. Adds lastUpdated dates to milestones for activity badge derivation
 * 4. Adds new objective fields (direction, refreshCycleYears)
 *
 * Run: node scripts/update-demo-data.js
 * Then: npm run data:build:sample to regenerate JSON
 */

import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const XLSX_PATH = path.join(repoRoot, 'template', 'chip-sample.xlsx');

// Priority area configuration - NO fake outcome currentValues!
// Outcome values should be null (awaiting measurement) unless real data exists
const PRIORITY_CONFIG = {
  'nutrition-security': { 
    currentValue: null,  // Awaiting next survey
    refreshCycleYears: 3,
    direction: 'higher_is_better'
  },
  'anxiety-stress': { 
    currentValue: null,  // Awaiting next survey
    refreshCycleYears: 1,
    direction: 'lower_is_better'
  },
  'crc-screening': { 
    currentValue: null,  // Awaiting next survey
    refreshCycleYears: 4,
    direction: 'higher_is_better'
  },
};

// Milestone status and lastUpdated for demo variety
// Activity Progress is calculated from these statuses
const MILESTONE_CONFIG = {
  '3.1-m1': { status: 'complete', lastUpdated: '2026-08-15' },
  '3.1-m2': { status: 'in_progress', lastUpdated: '2026-08-22' },
  '5.1-m1': { status: 'complete', lastUpdated: '2026-07-20' },
  '5.1-m2': { status: 'complete', lastUpdated: '2026-08-01' },
  '5.1-m3': { status: 'in_progress', lastUpdated: '2026-08-28' },
  '33.0-m1': { status: 'in_progress', lastUpdated: '2026-08-10' },
  '33.0-m2': { status: 'in_progress', lastUpdated: '2026-08-10' },
  '33.0-m3': { status: 'not_started', lastUpdated: null },
};

function ensureColumn(headers, data, columnName) {
  let idx = headers.indexOf(columnName);
  if (idx === -1) {
    headers.push(columnName);
    idx = headers.length - 1;
    console.log(`  Added new column: ${columnName}`);
  }
  return idx;
}

function main() {
  console.log(`Reading: ${XLSX_PATH}`);
  const buf = fs.readFileSync(XLSX_PATH);
  const wb = XLSX.read(buf, { cellDates: true, type: 'buffer' });

  // Update Priorities sheet
  const prioritiesSheet = wb.Sheets['Priorities'];
  const prioritiesData = XLSX.utils.sheet_to_json(prioritiesSheet, { header: 1, raw: true });
  const headers = prioritiesData[0];
  
  const priorityIdIdx = headers.indexOf('priorityId');
  const currentValueIdx = ensureColumn(headers, prioritiesData, 'currentValue');
  const asOfDateIdx = ensureColumn(headers, prioritiesData, 'asOfDate');
  const sourceIdx = ensureColumn(headers, prioritiesData, 'source');
  const refreshCycleYearsIdx = ensureColumn(headers, prioritiesData, 'refreshCycleYears');
  const directionIdx = ensureColumn(headers, prioritiesData, 'direction');

  // Update each priority
  for (let i = 1; i < prioritiesData.length; i++) {
    const row = prioritiesData[i];
    const priorityId = row[priorityIdIdx];
    const config = PRIORITY_CONFIG[priorityId];
    if (config) {
      row[currentValueIdx] = config.currentValue;  // null = awaiting measurement
      row[asOfDateIdx] = '';
      row[sourceIdx] = '';
      row[refreshCycleYearsIdx] = config.refreshCycleYears;
      row[directionIdx] = config.direction;
      console.log(`  Updated ${priorityId}: currentValue=null (awaiting), direction=${config.direction}`);
    }
  }

  const newPrioritiesSheet = XLSX.utils.aoa_to_sheet(prioritiesData);
  wb.Sheets['Priorities'] = newPrioritiesSheet;

  // Update Milestones sheet
  const milestonesSheet = wb.Sheets['Milestones'];
  const milestonesData = XLSX.utils.sheet_to_json(milestonesSheet, { header: 1, raw: true });
  const milestoneHeaders = milestonesData[0];
  
  const milestoneIdIdx = milestoneHeaders.indexOf('milestoneId');
  const statusIdx = ensureColumn(milestoneHeaders, milestonesData, 'status');
  const lastUpdatedIdx = ensureColumn(milestoneHeaders, milestonesData, 'lastUpdated');

  // Update each milestone
  for (let i = 1; i < milestonesData.length; i++) {
    const row = milestonesData[i];
    const milestoneId = row[milestoneIdIdx];
    const config = MILESTONE_CONFIG[milestoneId];
    if (config) {
      const oldStatus = row[statusIdx];
      row[statusIdx] = config.status;
      row[lastUpdatedIdx] = config.lastUpdated || '';
      console.log(`  Updated ${milestoneId}: status=${config.status}, lastUpdated=${config.lastUpdated || 'null'}`);
    }
  }

  const newMilestonesSheet = XLSX.utils.aoa_to_sheet(milestonesData);
  wb.Sheets['Milestones'] = newMilestonesSheet;

  // Save the workbook
  XLSX.writeFile(wb, XLSX_PATH);
  console.log(`\nWrote: ${XLSX_PATH}`);
  console.log('\nDemo data configured for Progression Measurement methodology:');
  console.log('  - Activity Progress (milestone-based) is the headline metric');
  console.log('  - Outcome currentValues cleared to null (awaiting measurement)');
  console.log('  - Milestone statuses set for demo variety');
  console.log('  - lastUpdated dates added for activity badge calculation');
  console.log('\nRun "npm run data:build:sample" to regenerate chip-data.json');
}

main();
