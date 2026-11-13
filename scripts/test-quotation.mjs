import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const html = await fs.readFile(new URL('../public/tools/quotation-generator.html', import.meta.url), 'utf8');
const source = html.match(/<script id="quotation-math">([\s\S]*?)<\/script>/)?.[1];
assert(source, 'Quotation math script must exist');
const context = vm.createContext({});
vm.runInContext(source, context);
const { calculate, money, normalize } = context.QuoteMath;
const fixture = (fees, taxRate = '13') => ({ schemaVersion: 1, title: '示例报价', company: '示例单位', customer: '', number: '', date: '2026-11-13', taxRate, notes: '', showLogo: false, products: [{ name: '测试产品', fees }] });
const fee = (quantity, price) => ({ name: '测试费用', quantity, price });
let checks = 0;
const check = (name, run) => { run(); checks++; console.log(`PASS ${name}`); };
check('decimal multiplication avoids floating-point tails', () => {
  const result = calculate(fixture([fee('3', '0.1')]));
  assert.equal(result.total, 30n); assert.equal(result.tax, 4n); assert.equal(money(result.grand), '0.34');
});
check('half-up at one half cent', () => {
  assert.equal(calculate(fixture([fee('1', '0.005')])).total, 1n);
  assert.equal(calculate(fixture([fee('1', '0.004999')])).total, 0n);
});
check('tax is rounded per line before summing', () => {
  const result = calculate(fixture([fee('1', '0.05'), fee('1', '0.05')]));
  assert.equal(result.total, 10n); assert.equal(result.tax, 2n); assert.equal(result.grand, 12n);
});
check('six-place quantity and price remain exact', () => {
  assert.equal(calculate(fixture([fee('0.123456', '0.654321')])).total, 8n);
  assert.equal(calculate(fixture([fee('2200', '0.136364')])).total, 30000n);
});
check('tax rate zero, fractional and 100 percent', () => {
  assert.equal(calculate(fixture([fee('1', '100')], '0')).tax, 0n);
  assert.equal(calculate(fixture([fee('1', '100')], '12.3456')).tax, 1235n);
  assert.equal(calculate(fixture([fee('1', '100')], '100')).tax, 10000n);
});
check('negative, exponent, overprecision and out-of-range rate rejected', () => {
  for (const price of ['-1', '1e3', '0.1234567', '', 'NaN']) assert.throws(() => calculate(fixture([fee('1', price)])), /单价/);
  assert.throws(() => calculate(fixture([fee('1', '1')], '100.0001')), /税率/);
});
check('line limit and upper boundary', () => {
  assert.equal(calculate(fixture([fee('1', '999999999.99')])).total, 99999999999n);
  assert.throws(() => calculate(fixture([fee('999999999', '999999999')])), /不能超过/);
});
check('product and grand totals agree with rows', () => {
  const input = fixture([fee('24', '0.375'), fee('24', '1.25'), fee('24', '0.1'), fee('1', '250')]);
  input.products.push({ name: '测试产品 B', fees: [fee('12', '0.6'), fee('12', '2.3')] });
  const result = calculate(input);
  assert.equal(result.total, 32620n); assert.equal(result.tax, 4241n); assert.equal(result.grand, 36861n);
  assert.equal(result.products.reduce((n, p) => n + p.subtotal, 0n), result.total);
});
check('invalid dates and empty products rejected', () => {
  const input = fixture([fee('1', '1')]); input.date = '2026-02-30'; assert.throws(() => calculate(input), /日期/);
  input.date = '2024-02-29'; assert.equal(calculate(input).total, 100n);
  input.products = []; assert.throws(() => calculate(input), /至少添加/);
});
check('import schema, limits and known fields', () => {
  const input = fixture([fee('1', '1')]); input.extra = 'ignored';
  assert.equal(normalize(input).extra, undefined);
  assert.throws(() => normalize({ schemaVersion: 2, products: [] }), /支持/);
  assert.throws(() => normalize({ ...input, products: Array(51).fill(input.products[0]) }), /50/);
  assert.throws(() => normalize({ ...input, products: [{ name: '产品', fees: Array(501).fill(fee('1', '1')) }] }), /500/);
  assert.throws(() => normalize({ ...input, notes: 'a'.repeat(6001) }), /长度/);
});
check('draft import preserves incomplete values for editing', () => {
  const input = fixture([fee('', '1')]); assert.equal(normalize(input).products[0].fees[0].quantity, '');
  assert.throws(() => calculate(normalize(input)), /数量/);
});
check('legacy drafts receive empty line notes, default logo and column width', () => {
  const input = normalize(fixture([fee('1', '1')]));
  assert.equal(input.products[0].fees[0].notes, '');
  assert.equal(input.logoData, ''); assert.equal(input.productWidth, '32');
});
check('notes, multiline names, logo and column width survive normalization', () => {
  const input = fixture([{ ...fee('1', '1'), notes: '按图纸要求\n分批交付' }]);
  input.products[0].name = '产品 A\n型号 B'; input.logoData = 'data:image/png;base64,AAAA'; input.productWidth = '42';
  const result = normalize(input);
  assert.equal(result.products[0].fees[0].notes, '按图纸要求\n分批交付');
  assert.equal(result.products[0].name, '产品 A\n型号 B');
  assert.equal(result.logoData, input.logoData); assert.equal(result.productWidth, '42');
  assert.throws(() => normalize({ ...input, productWidth: '43' }), /列宽/);
  assert.throws(() => normalize({ ...input, logoData: 'javascript:alert(1)' }), /Logo/);
  input.products[0].fees[0].notes = 'a'.repeat(1001); assert.throws(() => normalize(input), /长度/);
});
console.log(`${checks} quotation checks passed`);
