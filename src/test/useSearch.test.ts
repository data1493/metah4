import { describe, it, expect } from 'vitest'
import { hashQuery } from '../hooks/useSearch'

describe('hashQuery', () => {
  it('returns a 64-character hex string', async () => {
    const result = await hashQuery('hello world')
    expect(result).toHaveLength(64)
    expect(result).toMatch(/^[0-9a-f]{64}$/)
  })

  it('produces consistent hashes for the same input', async () => {
    const a = await hashQuery('test query')
    const b = await hashQuery('test query')
    expect(a).toBe(b)
  })

  it('produces different hashes for different inputs', async () => {
    const a = await hashQuery('query one')
    const b = await hashQuery('query two')
    expect(a).not.toBe(b)
  })
})
