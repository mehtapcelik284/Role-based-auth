import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../model/role.enum';
import { ROLES_KEY } from '../decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    [
      'EXECUTIVE',
      'SECRETARY',
      'PARENT',
      'PARENTAL_ASSISTANT',
      'TEACHER',
      'DOCTOR',
      'PSYCHOLOGIST',
      'NURSE',
      'SERVICE_DRIVER',
      'SERVICE_ATTENDANT',
    ];

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
