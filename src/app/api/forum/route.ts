
import { NextRequest, NextResponse } from 'next/server'

const allPosts = [
  { id: 'd1', title: 'Best practices for selling electronics on PostAll', category: 'Tips & Tricks', author: 'Emeka O.', replies: 23, views: 450, time: '2h ago', hot: true, pinned: false },
  { id: 'd2', title: 'How I earned ₦500K in my first month as a freelancer', category: 'Success Stories', author: 'Amina K.', replies: 45, views: 1200, time: '5h ago', hot: true, pinned: false },
  { id: 'd3', title: 'Safety tips: Meeting buyers for the first time', category: 'Tips & Tricks', author: 'Kwame M.', replies: 18, views: 890, time: '1d ago', hot: false, pinned: false },
  { id: 'd4', title: 'Feature request: Dark mode scheduling', category: 'Feedback', author: 'Fatima A.', replies: 8, views: 320, time: '2d ago', hot: false, pinned: false },
  { id: 'd5', title: 'My experience using the escrow system', category: 'Success Stories', author: 'Chinedu E.', replies: 32, views: 980, time: '3d ago', hot: false, pinned: false },
  { id: 'd6', title: 'How to get verified quickly on PostAll', category: 'Tips & Tricks', author: 'Zainab M.', replies: 12, views: 567, time: '4d ago', hot: false, pinned: false },
  { id: 'd7', title: 'Introduce yourself! New members thread', category: 'General', author: 'PostAll Team', replies: 156, views: 2300, time: '1w ago', hot: false, pinned: true },
  { id: 'd8', title: 'Crypto payments - my experience using USDT', category: 'General', author: 'David O.', replies: 28, views: 780, time: '5d ago', hot: false, pinned: false },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'recent'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  let filtered = [...allPosts]

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (sort === 'hot') {
    filtered = filtered.sort((a, b) => {
      if (a.hot && !b.hot) return -1
      if (!a.hot && b.hot) return 1
      return b.views - a.views
    })
  } else if (sort === 'replies') {
    filtered = filtered.sort((a, b) => b.replies - a.replies)
  } else if (sort === 'views') {
    filtered = filtered.sort((a, b) => b.views - a.views)
  } else {
    // Pinned first
    filtered = filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })
  }

  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  return NextResponse.json({
    data: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  })
}
