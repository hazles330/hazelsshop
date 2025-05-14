import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateUserPoints } from "@/utils/points"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const totalPoints = await calculateUserPoints(userId)
      return NextResponse.json({ totalPoints })
    }

    // 모든 포인트 내역 조회
    const points = await prisma.point.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(points)
  } catch (error) {
    console.error('Points fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const point = await prisma.point.create({
      data: {
        userId: json.userId,
        amount: json.amount,
        reason: json.reason,
        type: json.type || 'earn'  // 'earn' or 'spend'
      }
    })
    return NextResponse.json(point)
  } catch (error) {
    console.error('Point creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create point record' },
      { status: 500 }
    )
  }
}
