import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

// GET /api/admin/users/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id]/role
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await request.json();

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id]/{status|password}
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 사용자 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 상태 변경
    if (pathname.endsWith('/status')) {
      const { status } = data;
      if (!['active', 'inactive', 'banned'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: { status }
      });

      return NextResponse.json(updatedUser);
    }
    // 비밀번호 변경
    else if (pathname.endsWith('/password')) {
      const { password } = data;
      if (!password || password.length < 8) {
        return NextResponse.json(
          { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: { password: hashedPassword }
      });

      return NextResponse.json({ success: true });
    }
    else {
      return NextResponse.json(
        { error: 'Invalid operation' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}