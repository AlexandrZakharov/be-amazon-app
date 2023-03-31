import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";

@Injectable()
export class StatisticsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  async getMain(userId: number) {
    const user = await this.userService.byId(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    });

    const orders = await this.prismaService.order.findMany({
      where: { userId },
      select: {
        items: true,
      },
    });

    return orders;
  }
}
