import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(banners)
  } catch (error) {
    console.error('Banners fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const banner = await prisma.banner.create({
      data: {
        title: json.title,
        imageUrl: json.imageUrl,
        link: json.link,
        isActive: json.isActive,
        startDate: new Date(json.startDate),
        endDate: new Date(json.endDate)
      }
    })
    return NextResponse.json(banner)
  } catch (error) {
    console.error('Banner creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const banner = await prisma.banner.update({
      where: {
        id: json.id
      },
      data: {
        title: json.title,
        imageUrl: json.imageUrl,
        link: json.link,
        isActive: json.isActive,
        startDate: new Date(json.startDate),
        endDate: new Date(json.endDate)
      }
    })
    return NextResponse.json(banner)
  } catch (error) {
    console.error('Banner update error:', error)
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      )
    }
    
    await prisma.banner.delete({
      where: {
        id: id
      }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Banner deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    )
  }
}
