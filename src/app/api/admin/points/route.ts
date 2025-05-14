import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
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

// 사용자별 포인트 총액 조회
export async function getUserPoints(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const points = await prisma.point.findMany({
      where: {
        userId: userId
      }
    })

    const totalPoints = points.reduce((acc, point) => {
      return point.type === 'earn' ? 
        acc + point.amount : 
        acc - point.amount
    }, 0)

    return NextResponse.json({ totalPoints })
  } catch (error) {
    console.error('Points calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate points' },
      { status: 500 }
    )
  }
}
