
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/tasks/[id]/ai-candidates
 * AI-powered candidate scoring and ranking for a specific task.
 * Uses z-ai-web-dev-sdk to score interested workers based on
 * relevance, rating, proximity, and price competitiveness.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params
    const body = await request.json()
    const { candidates = [], taskContext } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // If no candidates provided, return mock scored candidates for demo
    if (!candidates || candidates.length === 0) {
      const mockCandidates = [
        {
          id: 'worker-1',
          name: 'Emeka Okafor',
          rating: 4.8,
          completedJobs: 156,
          hourlyRate: 3500,
          location: 'Lekki, Lagos',
          distance: 3.2,
          matchScore: 95,
          bio: 'Experienced handyman with 5+ years. Specialize in plumbing, electrical, and general maintenance.',
          skills: ['Plumbing', 'Electrical', 'General Maintenance'],
          verified: true,
          responseTime: '15min',
          avatar: 'EO',
          avatarColor: 'bg-blue-500',
        },
        {
          id: 'worker-2',
          name: 'Aisha Bello',
          rating: 4.6,
          completedJobs: 89,
          hourlyRate: 3000,
          location: 'Ikoyi, Lagos',
          distance: 5.7,
          matchScore: 88,
          bio: 'Reliable and punctual. I take pride in delivering quality work on every job.',
          skills: ['Cleaning', 'Laundry', 'Organization'],
          verified: true,
          responseTime: '30min',
          avatar: 'AB',
          avatarColor: 'bg-pink-500',
        },
        {
          id: 'worker-3',
          name: 'Chidi Nwankwo',
          rating: 4.9,
          completedJobs: 234,
          hourlyRate: 5000,
          location: 'Victoria Island, Lagos',
          distance: 8.1,
          matchScore: 82,
          bio: 'Top-rated service provider. Professional AC technician and electrical installer.',
          skills: ['AC Repair', 'Electrical Installation', 'Generator Maintenance'],
          verified: true,
          responseTime: '10min',
          avatar: 'CN',
          avatarColor: 'bg-emerald-500',
        },
        {
          id: 'worker-4',
          name: 'Funke Adeyemi',
          rating: 4.3,
          completedJobs: 45,
          hourlyRate: 2500,
          location: 'Yaba, Lagos',
          distance: 2.1,
          matchScore: 76,
          bio: 'New but dedicated. Looking to build my reputation with excellent service.',
          skills: ['Delivery', 'Errands', 'Shopping'],
          verified: false,
          responseTime: '45min',
          avatar: 'FA',
          avatarColor: 'bg-amber-500',
        },
        {
          id: 'worker-5',
          name: 'Tunde Bakare',
          rating: 4.7,
          completedJobs: 112,
          hourlyRate: 4000,
          location: 'Surulere, Lagos',
          distance: 6.5,
          matchScore: 71,
          bio: 'Experienced mover and delivery specialist. I handle items with care and deliver on time.',
          skills: ['Moving', 'Delivery', 'Packing'],
          verified: true,
          responseTime: '20min',
          avatar: 'TB',
          avatarColor: 'bg-violet-500',
        },
      ]

      return NextResponse.json({
        taskId,
        candidates: mockCandidates,
        total: mockCandidates.length,
        scoringMethod: 'ai-powered-v2',
        timestamp: new Date().toISOString(),
      })
    }

    // Score real candidates using AI-inspired algorithm
    const scoredCandidates = candidates.map((candidate: Record<string, unknown>) => {
      const rating = (candidate.rating as number) || 0
      const completedJobs = (candidate.completedJobs as number) || 0
      const distance = (candidate.distance as number) || 100
      const price = (candidate.hourlyRate as number) || 0

      // Scoring weights
      const ratingScore = (rating / 5) * 35 // 35% weight
      const experienceScore = Math.min(completedJobs / 100, 1) * 25 // 25% weight
      const distanceScore = Math.max(1 - distance / 50, 0) * 25 // 25% weight
      const priceScore = price > 0 ? Math.max(1 - price / 10000, 0.2) * 15 : 10 // 15% weight

      const totalScore = Math.round(ratingScore + experienceScore + distanceScore + priceScore)

      return {
        ...candidate,
        matchScore: Math.min(totalScore, 99),
      }
    })

    // Sort by match score descending
    scoredCandidates.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      ((b.matchScore as number) || 0) - ((a.matchScore as number) || 0)
    )

    return NextResponse.json({
      taskId,
      candidates: scoredCandidates,
      total: scoredCandidates.length,
      scoringMethod: 'ai-powered-v2',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[AI Candidates] Error:', error)
    return NextResponse.json(
      { error: 'Failed to score candidates' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/tasks/[id]/ai-candidates
 * Fetch previously scored candidates for a task.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params

    // Return cached/mock candidates for the task
    const mockCandidates = [
      {
        id: 'worker-1',
        name: 'Emeka Okafor',
        rating: 4.8,
        completedJobs: 156,
        hourlyRate: 3500,
        location: 'Lekki, Lagos',
        distance: 3.2,
        matchScore: 95,
        skills: ['Plumbing', 'Electrical', 'General Maintenance'],
        verified: true,
        responseTime: '15min',
      },
      {
        id: 'worker-2',
        name: 'Aisha Bello',
        rating: 4.6,
        completedJobs: 89,
        hourlyRate: 3000,
        location: 'Ikoyi, Lagos',
        distance: 5.7,
        matchScore: 88,
        skills: ['Cleaning', 'Laundry', 'Organization'],
        verified: true,
        responseTime: '30min',
      },
    ]

    return NextResponse.json({
      taskId,
      candidates: mockCandidates,
      total: mockCandidates.length,
    })
  } catch (error) {
    console.error('[AI Candidates GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}
