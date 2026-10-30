/**
 * Re-exports docs/test-cases/Toolshop_Test_Cases_Xray.xlsx from the .feature files, which are the
 * master. Run with: npm run export:testcases
 *
 * Taken from the feature files: summary, Gherkin text, labels (tags), repository path and file.
 * Kept from the existing workbook (not expressible in Gherkin): priority and precondition.
 * New scenarios get priority "Medium" and precondition "None" until someone edits the sheet.
 */
const fs = require('node:fs');
const path = require('node:path');
const { Parser, AstBuilder, GherkinClassicTokenMatcher } = require('@cucumber/gherkin');
const { IdGenerator } = require('@cucumber/messages');
const ExcelJS = require('exceljs');

const ROOT = path.resolve(__dirname, '..');
const WORKBOOK = path.join(ROOT, 'docs', 'test-cases', 'Toolshop_Test_Cases_Xray.xlsx');
const ID_TAG = /^@([A-Z0-9]+-\d+)$/;
const PATH_LINE = /^\s*Test repository path:\s*(.+?)\s*$/m;
const DEFAULT_PATH = 'Toolshop/Other';

function listFeatureFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? listFeatureFiles(path.join(dir, e.name))
        : e.name.endsWith('.feature')
          ? [path.join(dir, e.name)]
          : [],
    )
    .sort();
}

function parseFeature(file) {
  const parser = new Parser(new AstBuilder(IdGenerator.uuid()), new GherkinClassicTokenMatcher());
  return parser.parse(fs.readFileSync(file, 'utf8')).feature;
}

function renderTable(table, indent) {
  const rows = [table.tableHeader, ...table.tableBody].map((r) => r.cells.map((c) => c.value));
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  return rows.map((r) =>
    `${indent}| ${r.map((c, i) => c.padEnd(widths[i])).join(' | ')} |`.replace(/\s+$/, ''),
  );
}

function renderGherkin(scenario) {
  const lines = [`${scenario.keyword.trim()}: ${scenario.name}`];
  for (const step of scenario.steps) lines.push(`  ${step.keyword.trim()} ${step.text}`);
  for (const ex of scenario.examples) {
    lines.push('', '  Examples:', ...renderTable(ex, '    '));
  }
  return lines.join('\n');
}

function collectScenarios() {
  const out = [];
  for (const file of listFeatureFiles(path.join(ROOT, 'features'))) {
    const feature = parseFeature(file);
    if (!feature) continue;
    const repoPath = (PATH_LINE.exec(feature.description || '') || [])[1] || DEFAULT_PATH;
    const featureTags = feature.tags.map((t) => t.name);
    for (const child of feature.children) {
      const scenario = child.scenario;
      if (!scenario) continue;
      const tags = [...featureTags, ...scenario.tags.map((t) => t.name)];
      const idTag = tags.find((t) => ID_TAG.test(t));
      if (!idTag) continue; // framework sanity checks and the like have no test case ID
      out.push({
        key: ID_TAG.exec(idTag)[1],
        summary: scenario.name,
        type: scenario.keyword.trim(),
        gherkin: renderGherkin(scenario),
        labels: tags
          .filter((t) => t !== idTag && !/^@D-\d+$/.test(t))
          .map((t) => t.slice(1))
          .join(' '),
        repoPath,
        status: tags.includes('@known-bug') ? 'Known bug' : 'Automated',
        file: path.relative(ROOT, file).split(path.sep).join('/'),
      });
    }
  }
  return out;
}

/** Existing rows by key, so priority and precondition survive the export. */
function readExisting(ws) {
  const byKey = new Map();
  const order = [];
  ws.eachRow({ includeEmpty: false }, (row, n) => {
    if (n === 1) return;
    const key = String(row.getCell(1).value);
    byKey.set(key, { priority: row.getCell(6).value, precondition: row.getCell(9).value });
    order.push(key);
  });
  return { byKey, order };
}

function sortScenarios(scenarios, order) {
  const rank = new Map(order.map((k, i) => [k, i]));
  return [...scenarios].sort(
    (a, b) => (rank.get(a.key) ?? 1e6) - (rank.get(b.key) ?? 1e6) || a.key.localeCompare(b.key),
  );
}

function writeTestCases(ws, scenarios, existing) {
  const template = ws.getRow(2);
  const styles = Array.from({ length: 11 }, (_, i) => ({ ...template.getCell(i + 1).style }));
  ws.spliceRows(2, ws.rowCount, ...[]);
  scenarios.forEach((s, i) => {
    const keep = existing.byKey.get(s.key) || {};
    const row = ws.getRow(i + 2);
    row.values = [
      s.key,
      s.summary,
      'Cucumber',
      s.type,
      s.gherkin,
      keep.priority || 'Medium',
      s.labels,
      s.repoPath,
      keep.precondition || 'None',
      s.status,
      s.file,
    ];
    styles.forEach((st, c) => (row.getCell(c + 1).style = st));
    row.commit();
  });
  ws.autoFilter = `A1:K${scenarios.length + 1}`;
}

/** Rebuilds the folder x priority table so new folders get a row and ranges cover every test. */
function writeSummary(ws, paths, last) {
  const rowStyle = (r) =>
    Array.from({ length: 6 }, (_, c) => ({ ...ws.getRow(r).getCell(c + 1).style }));
  const body = rowStyle(4);
  const total = rowStyle(16);
  const stat = [18, 19, 20].map((r) => ({
    label: { ...ws.getCell(`A${r}`).style },
    value: { ...ws.getCell(`B${r}`).style },
  }));
  // spliceRows leaves trailing rows behind, so blank the old table cell by cell.
  for (let r = 4; r <= ws.rowCount; r++) {
    ws.getRow(r).eachCell({ includeEmpty: true }, (cell) => {
      cell.value = null;
      cell.style = {};
    });
  }

  const tc = (col) => `'Test Cases'!$${col}$2:$${col}$${last}`;
  paths.forEach((p, i) => {
    const r = 4 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = p;
    ['B', 'C', 'D', 'E'].forEach((col, c) => {
      row.getCell(c + 2).value = { formula: `COUNTIFS(${tc('H')},$A${r},${tc('F')},${col}$3)` };
    });
    row.getCell(6).value = { formula: `SUM(B${r}:E${r})` };
    body.forEach((st, c) => (row.getCell(c + 1).style = st));
  });
  const first = 4;
  const end = 3 + paths.length;
  const totalRow = ws.getRow(end + 1);
  totalRow.getCell(1).value = 'Total';
  ['B', 'C', 'D', 'E', 'F'].forEach((col, c) => {
    totalRow.getCell(c + 2).value = { formula: `SUM(${col}${first}:${col}${end})` };
  });
  total.forEach((st, c) => (totalRow.getCell(c + 1).style = st));

  const s = end + 3;
  const stats = [
    ['Scenario Outlines (data-driven)', `COUNTIF(${tc('D')},"Scenario Outline")`],
    ['Automated so far', `COUNTIF(${tc('J')},"Automated")+COUNTIF(${tc('J')},"Known bug")`],
    ['Automation progress', `IF(F${end + 1}=0,0,B${s + 1}/F${end + 1})`],
  ];
  stats.forEach(([label, formula], i) => {
    ws.getCell(`A${s + i}`).value = label;
    ws.getCell(`A${s + i}`).style = stat[i].label;
    ws.getCell(`B${s + i}`).value = { formula };
    ws.getCell(`B${s + i}`).style = stat[i].value;
  });
}

function updateLegend(ws, count) {
  const today = new Date().toISOString().slice(0, 10);
  const text = {
    Prepared: `${today} - exported from the .feature files (${count} test cases) by npm run export:testcases`,
    'Single source of truth':
      'The .feature files under /features are the master. Do not edit this sheet by hand except Priority and Precondition; run npm run export:testcases to refresh everything else.',
    'Known-bug tests':
      'Listed with Automation Status "Known bug": they assert the correct behaviour and are expected to fail until the site is fixed (see docs/known-defects.md).',
  };
  ws.eachRow((row) => {
    const label = String(row.getCell(1).value);
    if (text[label]) row.getCell(2).value = text[label];
  });
}

/** Traceability matrix for people browsing the repo: test ID to feature file, no Excel needed. */
function writeMatrix(scenarios, existing) {
  const rows = scenarios.map((s) => {
    const priority = (existing.byKey.get(s.key) || {}).priority || 'Medium';
    const tags = s.labels
      .split(' ')
      .map((t) => `\`@${t}\``)
      .join(' ');
    return `| ${s.key} | ${s.summary} | ${priority} | ${s.status} | ${tags} | [${s.file}](../${s.file}) |`;
  });
  const md = [
    '# Test case matrix',
    '',
    `Generated from the \`.feature\` files by \`npm run export:testcases\` (${scenarios.length} test cases). Do not edit by hand.`,
    '',
    '| ID | Scenario | Priority | Status | Tags | Feature file |',
    '| -- | -------- | -------- | ------ | ---- | ------------ |',
    ...rows,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, 'docs', 'test-case-matrix.md'), md);
}

async function main() {
  const scenarios = collectScenarios();
  const dupes = scenarios.map((s) => s.key).filter((k, i, a) => a.indexOf(k) !== i);
  if (dupes.length) throw new Error(`Duplicate test case IDs: ${[...new Set(dupes)].join(', ')}`);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(WORKBOOK);
  const cases = wb.getWorksheet('Test Cases');
  const existing = readExisting(cases);
  const sorted = sortScenarios(scenarios, existing.order);

  const existingPaths = [];
  cases.eachRow((row, n) => {
    if (n > 1 && !existingPaths.includes(row.getCell(8).value))
      existingPaths.push(row.getCell(8).value);
  });
  const paths = [...existingPaths];
  for (const s of sorted) if (!paths.includes(s.repoPath)) paths.push(s.repoPath);

  writeTestCases(cases, sorted, existing);
  writeSummary(wb.getWorksheet('Summary'), paths, sorted.length + 1);
  updateLegend(wb.getWorksheet('Legend'), sorted.length);
  await wb.xlsx.writeFile(WORKBOOK);
  writeMatrix(sorted, existing);

  const added = sorted.filter((s) => !existing.byKey.has(s.key)).map((s) => s.key);
  const removed = existing.order.filter((k) => !sorted.some((s) => s.key === k));
  console.log(`Exported ${sorted.length} test cases to ${path.relative(ROOT, WORKBOOK)}`);
  if (added.length) console.log(`  new: ${added.join(', ')}`);
  if (removed.length) console.log(`  dropped (no longer in features/): ${removed.join(', ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
