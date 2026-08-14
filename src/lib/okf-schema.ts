import { z } from 'astro:content'

/**
 * OKF v0.2 frontmatter schema (Zod). Shared by content.config.ts and tests.
 * Preprocessors coerce loose/legacy frontmatter into a stable shape.
 */
export const stringOrArray = z.preprocess(
  v => {
    if (v == null) return undefined
    if (typeof v === 'string') return [v]
    if (Array.isArray(v)) return v.map(x => String(x))
    return undefined
  },
  z.array(z.string()).optional()
)

export const looseString = z.preprocess(v => v == null ? undefined : String(v), z.string().optional())

export const okfSchema = z.object({
  type: z.preprocess(v => v == null ? 'other' : String(v), z.string().default('other')),
  title: looseString,
  description: looseString,
  resource: looseString,
  tags: stringOrArray,
  timestamp: z.preprocess(v => v == null ? undefined : (v instanceof Date ? v.toISOString() : String(v)), z.string().optional()),
  format_version: looseString,
  status: looseString,
  confidence: looseString,
  durability: looseString,
  supersedes: stringOrArray,
  superseded_by: stringOrArray,
  related: stringOrArray,
}).passthrough()
