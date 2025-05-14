import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const order = await prisma.order.create({
      data: {
        userId: json.userId,
        totalAmount: json.totalAmount,
        items: json.items,
        status: 'pending',
        shippingInfo: json.shippingInfo,
        paymentInfo: json.paymentInfo
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const order = await prisma.order.update({
      where: {
        id: json.id
      },
      data: {
        status: json.status,
        shippingInfo: json.shippingInfo,
        paymentInfo: json.paymentInfo
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
