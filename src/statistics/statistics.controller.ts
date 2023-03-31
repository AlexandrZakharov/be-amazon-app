import { Controller, Get } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { Auth } from "../auth/decorators/auth.decorator";

@Controller("statistics")
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get()
  async getMain(@CurrentUser("id") id: number) {
    return this.statisticsService.getMain(id);
  }
}
