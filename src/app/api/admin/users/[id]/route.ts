import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

// GET /api/admin/users/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id
      }
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
  const { role } = await request.json();
  const userIndex = users.findIndex(user => user.id === params.id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  if (!['admin', 'user'].includes(role)) {
    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    );
  }

  users[userIndex] = {
    ...users[userIndex],
    role
  };

  return NextResponse.json(users[userIndex]);
}

// PATCH /api/admin/users/[id]/{status|password}
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userIndex = users.findIndex(user => user.id === params.id);
  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  const data = await request.json();
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 상태 변경
  if (pathname.endsWith('/status')) {
    const { status } = data;
    if (!['active', 'inactive', 'banned'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    users[userIndex] = {
      ...users[userIndex],
      status
    };
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

    users[userIndex] = {
      ...users[userIndex],
      password // 실제로는 해시된 비밀번호를 저장해야 함
    };
  }
  else {
    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}