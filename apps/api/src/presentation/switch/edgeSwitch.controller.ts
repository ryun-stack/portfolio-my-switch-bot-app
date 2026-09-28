import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import type { Mediator } from "mediatr-ts";
import { CompleteSwitchRequestSchema } from "@my-switch-bot-app/shared-types";
import { CompleteSwitchRequestCommand } from "../../application/commands/CompleteSwitchRequestCommand";
import { EdgeClientAuthGuard } from "../auth/edgeClientAuthGuard";
import { RegisteredApplicationGuard } from "../auth/registeredApplicationGuard";
import { MEDIATOR } from "./mediator.provider";

/**
 * Presentation layer for the Edge device's callback into the API (ADR.md
 * 3.7/4章): once the edge device (Raspberry Pi) finishes driving the servo
 * for a SwitchRequest it picked up off the Queue, it reports success/
 * failure here so family members' polling (SwitchController#status) sees
 * the updated state.
 *
 * Guarded by EdgeClientAuthGuard + RegisteredApplicationGuard (client-
 * credentials/app-only token), not EntraIdAuthGuard/RegisteredUserGuard:
 * the edge device is not a family member, has no `email` claim, and
 * authenticates via its own Entra ID app registration + client secret
 * rather than a delegated user token. Mirrors SwitchController's
 * EntraIdAuthGuard + RegisteredUserGuard pairing (JWT parsing/decoration
 * guard, then a separate allowlist-check guard).
 */
@Controller("edge/switch")
@UseGuards(EdgeClientAuthGuard, RegisteredApplicationGuard)
export class EdgeSwitchController {
  constructor(@Inject(MEDIATOR) private readonly mediator: Mediator) {}

  @Patch(":requestId/status")
  async completeStatus(
    @Param("requestId") requestId: string,
    @Body() body: unknown
  ) {
    const parsed = CompleteSwitchRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        "Invalid request body: expected { status: 'done' | 'failed' }"
      );
    }

    const result = await this.mediator.send(
      new CompleteSwitchRequestCommand(requestId, parsed.data.status)
    );

    if (result === "not_found") {
      throw new NotFoundException(
        `SwitchRequest '${requestId}' was not found`
      );
    }
    if (result === "already_finalized") {
      throw new ConflictException(
        `SwitchRequest '${requestId}' has already been finalized`
      );
    }

    return { requestId, status: parsed.data.status };
  }
}
