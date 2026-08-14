import { describe, it, expect } from 'vitest'
import { okfSchema } from '../src/lib/okf-schema'

describe('okfSchema', () => {
  it('defaults type to "other" when absent', () => {
    const r = okfSchema.parse({})
    expect(r.type).toBe('other')
  })

  it('coerces a non-string type to string', () => {
    expect(okfSchema.parse({ type: 42 }).type).toBe('42')
  })

  it('wraps a scalar tag into an array (stringOrArray)', () => {
    expect(okfSchema.parse({ tags: 'infra' }).tags).toEqual(['infra'])
  })

  it('stringifies array members', () => {
    expect(okfSchema.parse({ tags: ['a', 7] }).tags).toEqual(['a', '7'])
  })

  it('leaves tags undefined when null/absent', () => {
    expect(okfSchema.parse({ tags: null }).tags).toBeUndefined()
    expect(okfSchema.parse({}).tags).toBeUndefined()
  })

  it('normalises a Date timestamp to an ISO string', () => {
    const d = new Date('2026-01-02T03:04:05.000Z')
    expect(okfSchema.parse({ timestamp: d }).timestamp).toBe(d.toISOString())
  })

  it('keeps a string timestamp as-is', () => {
    expect(okfSchema.parse({ timestamp: '2026-08-14' }).timestamp).toBe('2026-08-14')
  })

  it('coerces looseString fields (numbers -> string)', () => {
    const r = okfSchema.parse({ title: 123, confidence: 0.9 })
    expect(r.title).toBe('123')
    expect(r.confidence).toBe('0.9')
  })

  it('normalises related/supersedes to string arrays', () => {
    const r = okfSchema.parse({ related: 'slug/one', supersedes: ['x', 2] })
    expect(r.related).toEqual(['slug/one'])
    expect(r.supersedes).toEqual(['x', '2'])
  })

  it('passthrough retains unknown frontmatter keys', () => {
    const r = okfSchema.parse({ owner: 'chirag' }) as Record<string, unknown>
    expect(r.owner).toBe('chirag')
  })

  it('parses a realistic OKF card', () => {
    const r = okfSchema.parse({
      type: 'decision',
      title: 'Use npm on Windows',
      description: 'pnpm skips esbuild win32 binary',
      tags: ['build', 'windows'],
      status: 'active',
      timestamp: '2026-08-06T00:00:00Z',
      related: 'build/tooling',
    })
    expect(r.type).toBe('decision')
    expect(r.tags).toEqual(['build', 'windows'])
    expect(r.related).toEqual(['build/tooling'])
  })
})
