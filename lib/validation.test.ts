import test from 'node:test'
import assert from 'node:assert/strict'
import { parseLocalIsoDate, isTodayOrFutureIsoDate, sanitizePhoneDigits } from './validation'
import { normalizePhone } from './whatsapp'

test('parseLocalIsoDate parses valid YYYY-MM-DD dates in local time', () => {
  const d = parseLocalIsoDate('2026-11-19')
  assert.ok(d instanceof Date)
  assert.equal(d.getFullYear(), 2026)
  assert.equal(d.getMonth(), 10) // 0-indexed November
  assert.equal(d.getDate(), 19)
})

test('parseLocalIsoDate rejects malformed and impossible calendar dates', () => {
  assert.equal(parseLocalIsoDate('2026-02-30'), null)
  assert.equal(parseLocalIsoDate('2026-13-01'), null)
  assert.equal(parseLocalIsoDate('19-11-2026'), null)
  assert.equal(parseLocalIsoDate(''), null)
})

test('isTodayOrFutureIsoDate accepts today and future dates, rejects past dates', () => {
  const refNow = new Date(2026, 10, 19, 23, 59, 0) // 2026-11-19 23:59 local
  assert.equal(isTodayOrFutureIsoDate('2026-11-19', refNow), true)
  assert.equal(isTodayOrFutureIsoDate('2026-11-20', refNow), true)
  assert.equal(isTodayOrFutureIsoDate('2026-11-18', refNow), false)
  assert.equal(isTodayOrFutureIsoDate('invalid', refNow), false)
})

test('sanitizePhoneDigits strips formatting characters cleanly', () => {
  assert.equal(sanitizePhoneDigits('+91 63960-94707'), '916396094707')
  assert.equal(sanitizePhoneDigits('(987) 654 3210'), '9876543210')
})

test('normalizePhone normalizes 10-digit Indian numbers and international numbers', () => {
  assert.equal(normalizePhone('98765 43210'), '919876543210')
  assert.equal(normalizePhone('+91 63960 94707'), '916396094707')
  assert.equal(normalizePhone('12345'), null)
  assert.equal(normalizePhone(undefined), null)
})
