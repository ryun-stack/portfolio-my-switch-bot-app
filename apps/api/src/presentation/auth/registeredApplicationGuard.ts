import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from "@nestjs/common";
import type { ApplicationRepository } from "../../domain/repositories/ApplicationRepository";
import { Uuid } from "../../domain/shared/Uuid";
import { APPLICATION_REPOSITORY } from "../switch/repository.provider";
import type { RequestWithApplication } from "./authenticatedApplication";

/**
 * Checks whether the caller application attached by EdgeClientAuthGuard
 * (via `request.application.clientId`) is a registered caller application
 * (Table Storage `Applications` allowlist, ADR.md 3.9) — mirroring how
 * RegisteredUserGuard checks a family member's email against the `Users`
 * allowlist. Must run after EdgeClientAuthGuard.
 */
@Injectable()
export class RegisteredApplicationGuard implements CanActivate {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithApplication>();
    const application = request.application;
    if (!application?.clientId) {
      // No prior guard attached an application (or it had no clientId
      // claim) — treat this the same as "not a registered application"
      // rather than throwing, regardless of how/why this guard ran
      // without one.
      return false;
    }

    let clientId: Uuid;
    try {
      clientId = Uuid.create(application.clientId);
    } catch {
      // A malformed appid/azp claim can never match a registered application.
      return false;
    }

    const registeredApplication =
      await this.applicationRepository.findByClientId(clientId);
    if (!registeredApplication) {
      throw new ForbiddenException("Application is not registered");
    }

    // Attach the resolved Application's id, in case a future handler needs
    // it (mirroring RegisteredUserGuard attaching registeredUserId).
    application.registeredApplicationId = registeredApplication.id.toString();
    return true;
  }
}
