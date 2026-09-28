import { Injectable, CanActivate, ExecutionContext, Inject, ForbiddenException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { EmailAddress } from '../../domain/User/EmailAddress';
import { USER_REPOSITORY } from '../switch/repository.provider';
import type { RequestWithUser } from './authenticatedUser';

@Injectable()
export class RegisteredUserGuard implements CanActivate {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user?.email) {
      throw new ForbiddenException("Email claim is missing");
    }

    let emailAddress: EmailAddress;
    try {
      emailAddress = EmailAddress.create(user.email);
    } catch {
      // A malformed email claim can never match a registered user.
      throw new ForbiddenException("Email claim is invalid");
    }

    const registeredUser = await this.userRepository.findByEmailAddress(emailAddress);
    if (!registeredUser) {
       throw new ForbiddenException("User is not registered");
    }

    // Attach the resolved family member's id so Presentation can pass it
    // through as the SwitchRequest's executorId (history/auditing).
    user.registeredUserId = registeredUser.id.toString();
    return true;
  }
}