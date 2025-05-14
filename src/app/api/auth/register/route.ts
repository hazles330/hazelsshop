import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const json = await request.json()

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: {
        email: json.email
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(json.password, 10)

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: json.email,
        password: hashedPassword,
        name: json.name,
        role: 'user',
        status: 'active'
      }
    })

    // 비밀번호 필드 제외하고 반환
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
