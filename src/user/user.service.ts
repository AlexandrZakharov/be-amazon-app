import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { returnUserObject } from "./return-user.object";
import { Prisma } from "@prisma/client";
import { UserDto } from "./dto/user.dto";
import { hash } from "argon2";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async byId(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        ...selectObject,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async updateProfile(id: number, dto: UserDto) {
    const isSameUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (isSameUser && id !== isSameUser.id)
      throw new BadRequestException("Email already in use");

    const user = await this.byId(id);

    await this.prismaService.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });

    return await this.byId(id);
  }

  async toggleFavorite(userId: number, productId: number) {
    const user = await this.byId(userId);

    if (!user) throw new NotFoundException("User not found");

    const isProductExists = user.favorites.some(
      (product) => product.id === productId
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        favorites: {
          [isProductExists ? "disconnect" : "connect"]: {
            id: productId,
          },
        },
      },
    });

    return { message: "Profile has been updated" };
  }
}
