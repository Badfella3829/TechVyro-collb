import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateQuoteSummary,
  encodeQuoteToQuery,
  decodeQuoteFromQuery,
  formatViewsCompact,
} from './quote-builder'

describe('calculateQuoteSummary', () => {
  it('computes subtotal, 0% discount for <3 deliverables, views and CPM', () => {
    const summary = calculateQuoteSummary({ 'yt-dedicated': 1, 'ig-reel': 1 }, 'INR')
    assert.equal(summary.deliverableCount, 2)
    assert.equal(summary.subtotalInr, 33000)
    assert.equal(summary.discountPercent, 0)
    assert.equal(summary.totalInr, 33000)
    assert.equal(summary.estimatedViews, 250000)
    assert.equal(summary.blendedCpmInr, 132)
    assert.equal(summary.turnaroundDays, 6)
  })

  it('applies 10% bundle discount for 3-4 deliverables and 15% for 5+ deliverables', () => {
    const tier10 = calculateQuoteSummary({ 'yt-dedicated': 1, 'ig-reel': 2 }, 'INR')
    assert.equal(tier10.deliverableCount, 3)
    assert.equal(tier10.discountPercent, 10)
    assert.equal(tier10.subtotalInr, 41000)
    assert.equal(tier10.discountAmountInr, 4100)
    assert.equal(tier10.totalInr, 36900)

    const tier15 = calculateQuoteSummary({ 'ig-reel': 3, 'yt-short': 2 }, 'USD')
    assert.equal(tier15.deliverableCount, 5)
    assert.equal(tier15.discountPercent, 15)
    assert.equal(tier15.totalInr, 34000)
    assert.ok(tier15.totalDisplay.startsWith('$'))
  })

  it('handles rush delivery turnaround compression and empty selections cleanly', () => {
    const rushed = calculateQuoteSummary({ 'yt-dedicated': 1, 'addon-rush': 1 }, 'INR')
    assert.equal(rushed.turnaroundDays, 2)

    const empty = calculateQuoteSummary({}, 'INR')
    assert.equal(empty.totalInr, 0)
    assert.equal(empty.turnaroundDays, 0)
    assert.equal(empty.blendedCpmDisplay, '—')
  })
})

describe('quote URL serialization round-trip', () => {
  it('encodes and decodes selection, currency, and brand name safely', () => {
    const qs = encodeQuoteToQuery(
      { 'yt-dedicated': 2, 'ig-reel': 3, 'addon-usage': 1 },
      'USD',
      'Nothing India'
    )
    const decoded = decodeQuoteFromQuery(qs)
    assert.equal(decoded.currency, 'USD')
    assert.equal(decoded.brandName, 'Nothing India')
    assert.deepEqual(decoded.selection, {
      'yt-dedicated': 2,
      'ig-reel': 3,
      'addon-usage': 1,
    })
  })

  it('ignores unknown item ids and clamps quantities above maxQty', () => {
    const decoded = decodeQuoteFromQuery('qitems=fake:9,addon-rush:99,ig-reel:2&qcur=INR')
    assert.deepEqual(decoded.selection, {
      'addon-rush': 1,
      'ig-reel': 2,
    })
  })

  it('formats view counts compactly', () => {
    assert.equal(formatViewsCompact(1_250_000), '1.25M')
    assert.equal(formatViewsCompact(390_000), '390K')
    assert.equal(formatViewsCompact(500), '500')
  })
})
