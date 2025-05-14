import { prisma } from "@/lib/prisma";

export async function getUserPoints(userId: string) {
  try {
    const points = await prisma.point.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalPoints = points.reduce((acc, point) => {
      return point.type === 'earn' ? acc + point.amount : acc - point.amount;
    }, 0);

    return { totalPoints };
  } catch (error) {
    console.error('Get user points error:', error);
    throw new Error('Failed to get user points');
  }
}
