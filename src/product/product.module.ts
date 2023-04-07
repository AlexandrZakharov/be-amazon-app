import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PaginationService } from "../pagination/pagination.service";
import { PrismaService } from "../prisma.service";
import { CategoryService } from "../category/category.service";

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PaginationService,
    PrismaService,
    CategoryService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
