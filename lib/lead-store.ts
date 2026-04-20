import { promises as fs } from 'fs'
import path from 'path'

export type LeadSource = 'contact' | 'roi-report' | 'newsletter' | 'exit-intent' | 'recommender'
export type LeadStatus = 'new' | 'contacted' | 'booked' | 'closed' | 'lost'

export interface Lead {
  id: string
  source: LeadSource
  status: LeadStatus
  email: string
  name?: string
  phone?: string
  brand?: string
  budget?: string
  package?: string
  notes?: string
  payload?: Record<string, any>
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE_PATH = path.join(DATA_DIR, 'leads.json')

// Serialize all reads/writes through a single in-flight promise chain to prevent
// concurrent-write race conditions (multiple POSTs / PATCHes overwriting each other).
let queue: Promise<unknown> = Promise.resolve()
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn)
  queue = next.catch(() => undefined)
  return next
}

async function read(): Promise<{ leads: Lead[] }> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const raw = await fs.readFile(FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return { leads: Array.isArray(parsed.leads) ? parsed.leads : [] }
  } catch {
    return { leads: [] }
  }
}

async function write(data: { leads: Lead[] }): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export async function listLeads(): Promise<Lead[]> {
  return withLock(async () => {
    const { leads } = await read()
    return leads.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  })
}

export async function addLead(input: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: LeadStatus }): Promise<Lead> {
  return withLock(async () => {
    const data = await read()
    const now = new Date().toISOString()
    const lead: Lead = {
      id: `ld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      status: input.status || 'new',
      createdAt: now,
      updatedAt: now,
      ...input,
    }
    data.leads.unshift(lead)
    if (data.leads.length > 1000) data.leads.length = 1000
    await write(data)
    return lead
  })
}

export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead | null> {
  return withLock(async () => {
    const data = await read()
    const lead = data.leads.find((l) => l.id === id)
    if (!lead) return null
    lead.status = status
    if (notes !== undefined) lead.notes = String(notes).slice(0, 500)
    lead.updatedAt = new Date().toISOString()
    await write(data)
    return lead
  })
}

export async function deleteLead(id: string): Promise<boolean> {
  return withLock(async () => {
    const data = await read()
    const before = data.leads.length
    data.leads = data.leads.filter((l) => l.id !== id)
    if (data.leads.length === before) return false
    await write(data)
    return true
  })
}
