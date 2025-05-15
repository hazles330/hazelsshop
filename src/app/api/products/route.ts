import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiError, handleApiError } from "@/lib/api-error"
import { z } from "zod"

const ProductSchema = z.object({
  name: z.string().min(1, "상품명은 필수입니다"),
  description: z.string().min(1, "상품 설명은 필수입니다"),
  price: z.number().positive("가격은 양수여야 합니다"),
  stock: z.number().int().nonnegative("재고는 0 이상이어야 합니다"),
  image: z.string().url("이미지 URL이 유효하지 않습니다"),
  categoryId: z.string().uuid("카테고리 ID가 유효하지 않습니다")
})

export async function GET(): Promise<Response> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const json = await request.json()
    const validationResult = ProductSchema.safeParse(json)

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          message: "입력 데이터가 유효하지 않습니다",
          errors: validationResult.error.errors
        }),
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: validationResult.data,
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}