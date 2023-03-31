import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CategoryDto } from "../category/dto/category.dto";
import { faker } from "@faker-js/faker";
import { returnReviewObject } from "./return-review.object";
import { ReviewDto } from "./dto/review.dto";

@Injectable()
export class ReviewService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: returnReviewObject,
    });
  }

  async create(userId: number, productId: number, dto: ReviewDto) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${productId} doesn't exist`);

    return this.prismaService.review.create({
      data: {
        rating: dto.rating,
        text: dto.text,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAverageValueByProductId(productId: number) {
    return this.prismaService.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }
}
