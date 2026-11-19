import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { BLOG_POSTS, filterBlogPosts, getBlogCategories } from './blog-data'
import { CASE_STUDIES, filterCaseStudies, getCaseStudyCategories } from './case-studies-data'

describe('blog filtering helpers', () => {
  it('returns unique blog categories and filters by category and search text', () => {
    const categories = getBlogCategories()
    assert.ok(categories.includes('Short-Form'))
    assert.ok(categories.includes('ROI & Analytics'))

    const shortForm = filterBlogPosts(BLOG_POSTS, '', 'Short-Form')
    assert.equal(shortForm.length, 2)
    assert.ok(shortForm.every((p) => p.category === 'Short-Form'))

    const searchTag = filterBlogPosts(BLOG_POSTS, 'utm', 'All')
    assert.equal(searchTag.length, 1)
    assert.equal(searchTag[0].slug, 'measuring-influencer-roi')
  })
})

describe('case studies filtering helpers', () => {
  it('filters case studies by category and tag search', () => {
    const categories = getCaseStudyCategories()
    assert.equal(categories.length, 4)

    const viral = filterCaseStudies(CASE_STUDIES, '', 'Viral Growth')
    assert.equal(viral.length, 1)
    assert.equal(viral[0].slug, 'viral-unboxing-campaign')

    const byTag = filterCaseStudies(CASE_STUDIES, 'cac', 'All')
    assert.equal(byTag.length, 1)
    assert.equal(byTag[0].slug, 'community-driven-launch')
  })
})
