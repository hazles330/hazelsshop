import { prisma } from "@/lib/prisma"

export async function getUserPoints(userId: string) {
  try {
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

    return { totalPoints }
  } catch (error) {
    console.error('Points calculation error:', error)
    throw error
  }
}