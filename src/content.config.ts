import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { okfSchema } from './lib/okf-schema'

const CANDIDATES = [
  process.env.KNOWLEDGE_SRC,
  'C:/d/oriz/knowledge',
  resolve(process.cwd(), '../../../knowledge'),
].filter(Boolean) as string[]
const KNOWLEDGE_SRC = CANDIDATES.find(p => existsSync(p)) || CANDIDATES[0]
const baseUrl = pathToFileURL(KNOWLEDGE_SRC + '/').toString()

const concepts = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!_*.md', '!_*/**', '!**/_*.md'],
    base: baseUrl,
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/\\/g, '/'),
  }),
  schema: okfSchema,
})

export const collections = { concepts }
