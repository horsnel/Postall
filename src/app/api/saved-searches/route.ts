
import { NextRequest, NextResponse } from 'next/server'

const savedSearches = [
  { id: 's1', query: 'iPhone 14 Pro Max', category: 'for-sale', city: 'Lagos', priceMax: '700000', newMatches: 3, lastRun: '2h ago', active: true, frequency: 'instant' },
  { id: 's2', query: '2 Bedroom Flat Lekki', category: 'housing', city: 'Lagos', priceMax: '3000000', newMatches: 1, lastRun: '5h ago', active: true, frequency: 'hourly' },
  { id: 's3', query: 'WordPress Developer', category: 'gigs', city: 'all', priceMax: '', newMatches: 0, lastRun: '1d ago', active: true, frequency: 'daily' },
  { id: 's4', query: 'Toyota Camry 2019', category: 'for-sale', city: 'Abuja', priceMax: '5000000', newMatches: 2, lastRun: '3h ago', active: true, frequency: 'instant' },
  { id: 's5', query: 'Plumber Near Me', category: 'services', city: 'Accra', priceMax: '50000', newMatches: 5, lastRun: '30m ago', active: true, frequency: 'hourly' },
  { id: 's6', query: 'Part-time Data Entry', category: 'jobs', city: 'all', priceMax: '', newMatches: 0, lastRun: '2d ago', active: false, frequency: 'daily' },
]

export async function GET() {
  return NextResponse.json({ data: savedSearches, total: savedSearches.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { query, category, city, priceMax, frequency } = body

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const newSearch = {
    id: `s${Date.now()}`,
    query,
    category: category || 'all',
    city: city || 'all',
    priceMax: priceMax || '',
    newMatches: 0,
    lastRun: 'Just now',
    active: true,
    frequency: frequency || 'daily',
  }

  return NextResponse.json({ data: newSearch, message: 'Search saved successfully' }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Search ID is required' }, { status: 400 })
  }

  return NextResponse.json({ message: `Search ${id} deleted successfully` })
}
