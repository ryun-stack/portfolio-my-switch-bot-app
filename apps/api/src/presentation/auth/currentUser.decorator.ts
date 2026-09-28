import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser, RequestWithUser } from '../auth/authenticatedUser';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 引数（data）が渡された場合は、そのプロパティだけを返す
    if (data && user) {
      return user[data];
    }

    return user;
  },
);