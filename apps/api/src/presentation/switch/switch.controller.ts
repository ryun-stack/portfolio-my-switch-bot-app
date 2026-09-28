import {
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { Mediator } from "mediatr-ts";
import { PressSwitchCommand } from "../../application/commands/PressSwitchCommand";
import { GetSwitchStatusQuery } from "../../application/queries/GetSwitchStatusQuery";
import type { AuthenticatedUser } from "../auth/authenticatedUser";
import { EntraIdAuthGuard } from "../auth/entraIdAuthGuard";
import { RegisteredUserGuard } from "../auth/registeredUserGuard";
import { MEDIATOR } from "./mediator.provider";
import { CurrentUser } from "../auth/currentUser.decorator";

/**
 * Presentation layer for the switch use cases (Onion Architecture, ADR.md
 * 3.9). Replaces the previous Azure Functions HTTP triggers 1:1: routes and
 * status codes are unchanged, only the hosting mechanism (NestJS Controller
 * running in a container vs. a Functions HTTP trigger) differs.
 *
 * All routes require a valid Entra ID access token (ADR.md 3.3/Phase 2).
 */
@Controller("switch")
@UseGuards(EntraIdAuthGuard, RegisteredUserGuard)
export class SwitchController {
  constructor(@Inject(MEDIATOR) private readonly mediator: Mediator) {}

  @Post("press")
  @HttpCode(202)
  async press(@CurrentUser() user: AuthenticatedUser) {
    return this.mediator.send(new PressSwitchCommand(user!.registeredUserId!));
  }

  @Get("status/:requestId")
  async status(@Param("requestId") requestId: string) {
    const result = await this.mediator.send(
      new GetSwitchStatusQuery(requestId)
    );

    if (!result) {
      throw new NotFoundException(
        `SwitchRequest '${requestId}' was not found`
      );
    }

    return result;
  }
}
