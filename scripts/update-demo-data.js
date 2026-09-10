#!/usr/bin/env node
/**
 * update-demo-data.js
 *
 * Updates chip-sample.xlsx with fake demo data:
 * 1. Fills in plausible currentValue numbers for progress bars
 * 2. Sets milestone statuses to in_progress (not all not_started)
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

// Fake current values for demo - these are plausible progress points
// Baseline -> CurrentValue -> Target
const FAKE_CURRENT_VALUES = {
  'nutrition-security': 79.2,  // Baseline: 78%, Target: 81.9% (increase goal)
  'anxiety-stress': 45.8,      // Baseline: 47%, Target: 44% (decrease goal - progress = lower number)
  'crc-screening': 76.3,       // Baseline: 75.1%, Target: 78.8% (increase goal)
};

// Milestone status updates - most to in_progress, some complete for demo variety
const MILESTONE_STATUSES = {
  '3.1-m1': 'complete',      // First nutrition milestone complete
  '3.1-m2': 'in_progress',   // Second nutrition milestone in progress
  '5.1-m1': 'complete',      // First anxiety milestone complete
  '5.1-m2': 'complete',      // Second anxiety milestone complete
  '5.1-m3': 'in_progress',   // Third anxiety milestone in progress
  '33.0-m1': 'in_progress',  // CRC screening - events in progress
  '33.0-m2': 'in_progress',  // CRC screening - attendee increase in progress
  '33.0-m3': 'not_started',  // CRC screening - physician enrollment (starts later)
};

function main() {
  console.log(`Reading: ${XLSX_PATH}`);
  const buf = fs.readFileSync(XLSX_PATH);
  const wb = XLSX.read(buf, { cellDates: true, type: 'buffer' });

  // Update Priorities sheet with currentValue
  const prioritiesSheet = wb.Sheets['Priorities'];
  const prioritiesData = XLSX.utils.sheet_to_json(prioritiesSheet, { header: 1, raw: true });

  // Find currentValue column index
  const headers = prioritiesData[0];
  const priorityIdIdx = headers.indexOf('priorityId');
  const currentValueIdx = headers.indexOf('currentValue');

  if (currentValueIdx === -1) {
    console.error('currentValue column not found in Priorities sheet');
    process.exit(1);
  }

  // Update currentValue for each priority
  for (let i = 1; i < prioritiesData.length; i++) {
    const row = prioritiesData[i];
    const priorityId = row[priorityIdIdx];
    if (priorityId && FAKE_CURRENT_VALUES[priorityId] !== undefined) {
      row[currentValueIdx] = FAKE_CURRENT_VALUES[priorityId];
      console.log(`  Updated ${priorityId} currentValue to ${FAKE_CURRENT_VALUES[priorityId]}`);
    }
  }

  // Write back to sheet
  const newPrioritiesSheet = XLSX.utils.aoa_to_sheet(prioritiesData);
  wb.Sheets['Priorities'] = newPrioritiesSheet;

  // Update Milestones sheet with status
  const milestonesSheet = wb.Sheets['Milestones'];
  const milestonesData = XLSX.utils.sheet_to_json(milestonesSheet, { header: 1, raw: true });

  const milestoneHeaders = milestonesData[0];
  const milestoneIdIdx = milestoneHeaders.indexOf('milestoneId');
  const statusIdx = milestoneHeaders.indexOf('status');

  if (statusIdx === -1) {
    console.error('status column not found in Milestones sheet');
    process.exit(1);
  }

  // Update status for each milestone
  for (let i = 1; i < milestonesData.length; i++) {
    const row = milestonesData[i];
    const milestoneId = row[milestoneIdIdx];
    if (milestoneId && MILESTONE_STATUSES[milestoneId] !== undefined) {
      const oldStatus = row[statusIdx];
      row[statusIdx] = MILESTONE_STATUSES[milestoneId];
      console.log(`  Updated ${milestoneId} status: ${oldStatus} -> ${MILESTONE_STATUSES[milestoneId]}`);
    }
  }

  // Write back to sheet
  const newMilestonesSheet = XLSX.utils.aoa_to_sheet(milestonesData);
  wb.Sheets['Milestones'] = newMilestonesSheet;

  // Save the workbook
  XLSX.writeFile(wb, XLSX_PATH);
  console.log(`\nWrote: ${XLSX_PATH}`);
  console.log('Run "npm run data:build:sample" to regenerate chip-data.json');
}

main();
