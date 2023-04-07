import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import {
  returnProductObject,
  returnProductObjectFullset,
} from "./return-product.object";
import { ProductDto } from "./dto/product.dto";
import { faker } from "@faker-js/faker";
import { PaginationService } from "../pagination/pagination.service";
import { EnumProductSort, GetAllProductDto } from "./dto/get-all.product.dto";
import { Prisma } from "@prisma/client";
import { CategoryService } from "../category/category.service";

@Injectable()
export class ProductService {
  constructor(
    private paginationService: PaginationService,
    private prismaService: PrismaService,
    private categoryService: CategoryService
  ) {}

  async byId(id: number) {
    return this.getUnique({ id });
  }

  async bySlug(slug: string) {
    return this.getUnique({ slug });
  }

  async byCategorySlug(categorySlug: string) {
    await this.categoryService.bySlug(categorySlug);

    return this.getMany({ category: { slug: categorySlug } });
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct)
      throw new NotFoundException("Current product not found!");

    return this.prismaService.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: returnProductObject,
    });
  }

  private async getUnique(where: object) {
    const product = await this.prismaService.product.findUnique({
      where,
      select: returnProductObjectFullset,
    });

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }

  private async getMany(where: object) {
    return this.prismaService.product.findMany({
      where,
      select: returnProductObjectFullset,
    });
  }

  async getAll(dto: GetAllProductDto) {
    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (dto.sort) {
      case EnumProductSort.LOW_PRICE:
        prismaSort.push({ price: "asc" });
        break;
      case EnumProductSort.HIGH_PRICE:
        prismaSort.push({ price: "desc" });
        break;
      case EnumProductSort.OLDEST:
        prismaSort.push({ createdAt: "asc" });
        break;
      default:
        prismaSort.push({ price: "desc" });
        break;
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = dto.searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: dto.searchTerm,
                  mode: "insensitive",
                },
              },
            },
            {
              description: {
                contains: dto.searchTerm,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: dto.searchTerm,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);
    const products = await this.prismaService.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return {
      products,
      length: await this.prismaService.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async create() {
    try {
      const product = await this.prismaService.product.create({
        data: {
          description: "",
          name: "",
          slug: "",
          price: 0,
        },
      });

      return product.id;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, dto: ProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: {
        description: dto.description,
        images: dto.images,
        price: dto.price,
        name: dto.name,
        slug: faker.helpers.slugify(dto.name).toLowerCase(),
        category: {
          connect: {
            id: dto.categoryId,
          },
        },
      },
    });
  }

  async delete(id: number) {
    try {
      await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
