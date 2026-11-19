import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPackagePrice, mergePackageAddons } from './pricing'

test('formatPackagePrice formats INR values with Indian locale grouping', () => {
  assert.equal(formatPackagePrice(25000, 'INR'), '₹25,000')
  assert.equal(formatPackagePrice(100000, 'INR', true), '₹1,00,000+')
  assert.equal(formatPackagePrice(null, 'INR'), 'Revenue Share')
})

test('formatPackagePrice converts INR amounts into clean rounded USD values', () => {
  assert.equal(formatPackagePrice(25000, 'USD'), '$300')
  assert.equal(formatPackagePrice(100000, 'USD', true), '$1,190+')
  assert.equal(formatPackagePrice(2500, 'USD'), '$30')
  assert.equal(formatPackagePrice(null, 'USD'), 'Revenue Share')
})

test('mergePackageAddons appends unique selected add-ons without mutating base list', () => {
  const base = ['5-15 min video', 'Custom thumbnail']
  const merged = mergePackageAddons(base, ['Usage Rights', 'Rush Delivery'])
  assert.deepEqual(base, ['5-15 min video', 'Custom thumbnail'])
  assert.deepEqual(merged, [
    '5-15 min video',
    'Custom thumbnail',
    'Add-on: Usage Rights',
    'Add-on: Rush Delivery',
  ])
})
