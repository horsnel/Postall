
import { NextRequest, NextResponse } from 'next/server'

const activeAlerts = [
  { id: 'a1', item: 'MacBook Air M2', originalPrice: '₦900,000', currentPrice: '₦800,000', drop: '11%', city: 'Accra', icon: 'laptop', created: '3d ago', active: true },
  { id: 'a2', item: 'iPhone 14 Pro Max', originalPrice: '₦700,000', targetPrice: '₦600,000', drop: '0%', city: 'Lagos', icon: 'smartphone', created: '5d ago', active: true },
  { id: 'a3', item: 'Samsung 55" TV', originalPrice: '₦400,000', targetPrice: '₦350,000', drop: '8%', city: 'Nairobi', icon: 'tv', created: '1w ago', active: true },
  { id: 'a4', item: 'Standing Desk', originalPrice: '₦350,000', targetPrice: '₦280,000', drop: '20%', city: 'Lagos', icon: 'desk', created: '4d ago', active: true },
]

const triggeredAlerts = [
  { id: 't1', item: 'Gaming Chair', originalPrice: '₦300,000', currentPrice: '₦250,000', drop: '17%', city: 'Lagos', icon: 'chair', triggeredDate: '1d ago' },
  { id: 't2', item: 'Mountain Bike', originalPrice: '₦450,000', currentPrice: '₦400,000', drop: '11%', city: 'Lagos', icon: 'bike', triggeredDate: '3d ago' },
  { id: 't3', item: 'AirPods Pro', originalPrice: '₦180,000', currentPrice: '₦150,000', drop: '17%', city: 'Accra', icon: 'headphones', triggeredDate: '5h ago' },
]

export async function GET() {
  return NextResponse.json({
    data: {
      active: activeAlerts,
      triggered: triggeredAlerts,
      expired: [],
    },
    total: activeAlerts.length + triggeredAlerts.length,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { item, originalPrice, targetPrice, city } = body

  if (!item || !originalPrice) {
    return NextResponse.json({ error: 'Item and original price are required' }, { status: 400 })
  }

  const newAlert = {
    id: `a${Date.now()}`,
    item,
    originalPrice,
    targetPrice: targetPrice || '',
    drop: '0%',
    city: city || 'all',
    icon: 'laptop',
    created: 'Just now',
    active: true,
  }

  return NextResponse.json({ data: newAlert, message: 'Price alert created successfully' }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, active } = body

  if (!id) {
    return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 })
  }

  return NextResponse.json({
    data: { id, active },
    message: `Alert ${id} ${active ? 'activated' : 'deactivated'} successfully`,
  })
}
