import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { returnCategoryObject } from "./return-category.object";
import { CategoryDto } from "./dto/category.dto";
import { faker } from "@faker-js/faker";

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async byId(id: number) {
    return this.get({ id });
  }

  async bySlug(slug: string) {
    return this.get({ slug });
  }

  private async get(where: object) {
    const category = await this.prismaService.category.findUnique({
      where,
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException("Category not found");

    return category;
  }

  async getAll() {
    return this.prismaService.category.findMany({
      select: returnCategoryObject,
    });
  }

  async create() {
    return this.prismaService.category.create({
      data: {
        name: "",
        slug: "",
      },
    });
  }

  async update(id: number, dto: CategoryDto) {
    return this.prismaService.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: faker.helpers.slugify(dto.name).toLowerCase(),
      },
    });
  }

  async delete(id: number) {
    await this.prismaService.category.delete({
      where: { id },
    });
  }
}
