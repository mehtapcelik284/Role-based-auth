import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/modules/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/modules/auth/guard';
import { Role } from '../auth/model/role.enum';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator';

@Roles(Role.DOCTOR)
@UseGuards(JwtGuard, RoleGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(
    @GetUser() user: User,
    // @GetUser("email") email: string,
  ) {
    // console.log({ email });
    return user;
  }

  @Patch()
  editUser() {}
}
