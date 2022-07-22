import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthDto} from './dtos'
import {Tokens} from './types'
import {AtGuard, RolesGuard, RtGuard} from 'src/common/guards'
import {GetCurrentUser, GetCurrentUserId, Roles} from '../common/decorators'
import {Role} from 'src/database/enum'

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @Roles(Role.Admin)
  // @Post('/signup')
  // @HttpCode(HttpStatus.CREATED)
  // signup(@Body() dto: AuthDto): Promise<Tokens> {
  //   return this.authService.signupUser(dto)
  // }

  @Post('/signin/admin')
  // @Roles(Role.Admin, Role.VanThu)
  @HttpCode(HttpStatus.OK)
  async signinAdmin(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signinUser(dto)
  }
  @Post('/signin/user')
  @Roles(Role.User)
  @UseGuards(AtGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async signinUser(@Body() dto: AuthDto): Promise<Tokens> {
    return await this.authService.signinUser(dto)
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return await this.authService.logout(userId)
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return await this.authService.refresh(userId, refreshToken)
  }
}
