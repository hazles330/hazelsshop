import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Inquiries fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const inquiry = await prisma.inquiry.create({
      data: {
        userId: json.userId,
        title: json.title,
        content: json.content
      }
    })
    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Inquiry creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const inquiry = await prisma.inquiry.update({
      where: {
        id: json.id
      },
      data: {
        status: json.status,
        answer: json.answer
      }
    })
    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('Inquiry update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}
