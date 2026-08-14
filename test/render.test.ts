import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BaseLayout from '../src/layouts/BaseLayout.astro'

// Server-side render smoke test via the Astro Container API (no browser).
// showAuth=false suppresses the Clerk React island so the shell renders standalone.
describe('BaseLayout (render smoke)', () => {
  it('renders the document shell with the given title', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(BaseLayout, {
      props: { title: 'Test Card — knowledge.oriz.in', showAuth: false },
      slots: { default: '<p id="probe">catalogue body</p>' },
    })

    expect(html).toContain('<html lang="en">')
    expect(html).toContain('<title>Test Card — knowledge.oriz.in</title>')
    expect(html).toContain('Card&nbsp;Catalogue')
    expect(html).toContain('id="probe"')
    expect(html).toContain('href="/feed.xml"')
  })

  it('uses the default meta description when none is supplied', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(BaseLayout, {
      props: { title: 'x', showAuth: false },
    })
    expect(html).toMatch(/<meta name="description" content="[^"]+OKF knowledge base/)
  })
})
