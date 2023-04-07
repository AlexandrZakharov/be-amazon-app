import { Prisma } from "@prisma/client";
import { ArrayMinSize, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductDto implements Prisma.ProductUpdateInput {
  @IsString()
  name: string;

  @IsString()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @ArrayMinSize(1)
  images: string[];

  @IsNumber()
  categoryId: number;
}
