import {
  Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { ReviewDto } from "./dto/review.dto";
import { Auth } from "../auth/decorators/auth.decorator";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post("leave/:productId")
  async create(
    @CurrentUser("id") id: number,
    @Param("productId") productId: string,
    @Body() dto: ReviewDto
  ) {
    return this.reviewService.create(id, +productId, dto);
  }

  @UsePipes(new ValidationPipe())
  @Get("average/:productId")
  async getAverage(@Param("productId") productId: string) {
    return this.reviewService.getAverageValueByProductId(+productId);
  }
}
