import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { paths } from 'src/common/constants/paths';

@Controller(paths.auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(paths.sign_up)
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(paths.sign_in)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
