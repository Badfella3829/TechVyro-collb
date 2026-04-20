import { promises as fs } from 'fs'
import path from 'path'

export type SlotState = 'booked' | 'tentative'

export interface BookingEntry {
  id: string
  date: string // YYYY-MM-DD
  status: SlotState
  brandName: string
  contactName: string
  email: string
  phone?: string
  reference: string
  collabType?: string
  notes?: string
  confirmedAt?: string
  confirmationSent?: boolean
  createdAt: string
}

export interface AvailabilityData {
  bookings: BookingEntry[]
}

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE_PATH = path.join(DATA_DIR, 'availability.json')

async function ensureFile(): Promise<AvailabilityData> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const raw = await fs.readFile(FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as AvailabilityData
    if (!Array.isArray(parsed.bookings)) return { bookings: [] }
    return parsed
  } catch {
    return { bookings: [] }
  }
}

async function writeData(data: AvailabilityData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export async function listBookings(): Promise<BookingEntry[]> {
  const data = await ensureFile()
  return data.bookings.sort((a, b) => a.date.localeCompare(b.date))
}

function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime())
}

export async function addBooking(
  entry: Omit<BookingEntry, 'id' | 'createdAt'> & { id?: string }
): Promise<BookingEntry | null> {
  if (!isValidDate(entry.date)) return null
  const data = await ensureFile()
  const id = entry.id || `bk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  const booking: BookingEntry = {
    id,
    date: entry.date,
    status: entry.status,
    brandName: entry.brandName,
    contactName: entry.contactName,
    email: entry.email,
    phone: entry.phone,
    reference: entry.reference,
    collabType: entry.collabType,
    notes: entry.notes,
    createdAt: new Date().toISOString(),
  }
  data.bookings.push(booking)
  await writeData(data)
  return booking
}

export async function updateBookingStatus(
  id: string,
  status: SlotState
): Promise<{ entry: BookingEntry; previousStatus: SlotState } | null> {
  const data = await ensureFile()
  const idx = data.bookings.findIndex((b) => b.id === id)
  if (idx === -1) return null
  const previousStatus = data.bookings[idx].status
  data.bookings[idx].status = status
  if (status === 'booked' && previousStatus !== 'booked') {
    data.bookings[idx].confirmedAt = new Date().toISOString()
  }
  await writeData(data)
  return { entry: data.bookings[idx], previousStatus }
}

export async function markConfirmationSent(id: string): Promise<boolean> {
  const data = await ensureFile()
  const idx = data.bookings.findIndex((b) => b.id === id)
  if (idx === -1) return false
  data.bookings[idx].confirmationSent = true
  await writeData(data)
  return true
}

export async function getBookingById(id: string): Promise<BookingEntry | null> {
  const data = await ensureFile()
  return data.bookings.find((b) => b.id === id) || null
}

export async function removeBooking(id: string): Promise<boolean> {
  const data = await ensureFile()
  const before = data.bookings.length
  data.bookings = data.bookings.filter((b) => b.id !== id)
  if (data.bookings.length === before) return false
  await writeData(data)
  return true
}

export interface PublicAvailability {
  bookedDates: string[]
  tentativeDates: string[]
  totals: { booked: number; tentative: number }
}

export async function getPublicAvailability(): Promise<PublicAvailability> {
  const bookings = await listBookings()
  const bookedSet = new Set<string>()
  const tentativeSet = new Set<string>()
  for (const b of bookings) {
    if (b.status === 'booked') bookedSet.add(b.date)
    else tentativeSet.add(b.date)
  }
  // booked overrides tentative
  for (const d of bookedSet) tentativeSet.delete(d)
  return {
    bookedDates: Array.from(bookedSet).sort(),
    tentativeDates: Array.from(tentativeSet).sort(),
    totals: { booked: bookedSet.size, tentative: tentativeSet.size },
  }
}
