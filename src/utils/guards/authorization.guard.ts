import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRole = request?.currentUser?.role;

      if (userRole && allowedRoles.includes(userRole)) {
        return true;
      }

      throw new UnauthorizedException('Sorry, you are not authorized.');
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};
