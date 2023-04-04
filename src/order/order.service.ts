import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async getAll(userId: number) {
    return this.prismaService.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
