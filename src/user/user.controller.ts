import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @Auth()
  async getProfile(@CurrentUser("id") id: number) {
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put("profile")
  async updateProfile(@CurrentUser("id") id: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }

  @Auth()
  @HttpCode(200)
  @Patch("profile/favorites/:productId")
  async toggleFavorite(
    @CurrentUser("id") id: number,
    @Param("productId") productId: string
  ) {
    return this.userService.toggleFavorite(id, +productId);
  }
}
