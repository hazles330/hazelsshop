import { prisma } from "@/lib/prisma"

export async function calculateUserPoints(userId: string): Promise<number> {
  const points = await prisma.point.findMany({
    where: { userId }
  })

  return points.reduce((acc, point) => {
    return point.type === 'earn' ? 
      acc + point.amount : 
      acc - point.amount
  }, 0)
}