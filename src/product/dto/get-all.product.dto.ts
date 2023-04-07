import { PaginationDto } from "../../pagination/dto/pagination.dto";
import { IsEnum, IsOptional, IsString } from "class-validator";

export enum EnumProductSort {
  HIGH_PRICE,
  LOW_PRICE,
  NEWEST,
  OLDEST,
}

export class GetAllProductDto extends PaginationDto {
  @IsEnum(EnumProductSort)
  @IsOptional()
  sort?: EnumProductSort;

  @IsString()
  @IsOptional()
  searchTerm?: string;
}
