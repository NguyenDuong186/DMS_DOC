import {ForbiddenException, Injectable} from '@nestjs/common'
import {PrismaService} from 'src/database/prisma/prisma.service'
import {AuthDto} from './dtos'
import * as bcrypt from 'bcrypt'
import {Tokens} from './types'
import {JwtService} from '@nestjs/jwt'
// import {ConfigService} from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  // async signupUser(dto: AuthDto): Promise<Tokens> {
  //   const {email, password} = dto
  //   const hashPassword = await this.hashPassword(password)
  //   const userNew = await this.prisma.user.create({
  //     data: {
  //       email,
  //       password: hashPassword,
  //     },
  //   })
  //   const tokens = await this.getTokens(userNew.id, userNew.email)
  //   await this.updateFreshToken(userNew.id, tokens.refresh_token)
  //   return tokens
  // }

  async signinUser(dto: AuthDto): Promise<Tokens> {
    const {email, password} = dto
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new ForbiddenException('Access Denied')
    const correctPassword = await bcrypt.compare(password, user.password)
    if (!correctPassword) throw new ForbiddenException('Access Denied')
    const tokens = await this.getTokens(user.id, user.email, user.role)
    await this.updateFreshToken(user.id, tokens.refresh_token)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pw, hashedRT, ...result} = user
    const res = {...tokens, currentUser: result}
    return res
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRT: {not: null},
      },
      data: {
        hashedRT: null,
      },
    })
    return true
  }
  async refresh(userId: number, refresh_token: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user || !user.hashedRT) throw new ForbiddenException('Access Denied')
    const rtMatches = await bcrypt.compare(refresh_token, user.hashedRT)
    if (!rtMatches) throw new ForbiddenException('Access Denied')
    const tokens = await this.getTokens(user.id, user.email, user.role)
    await this.updateFreshToken(user.id, tokens.refresh_token)
    return tokens
  }

  hashPassword(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: number, email: string, roles: any): Promise<Tokens> {
    const payload = {sub: userId, email, iat: Date.now(), roles: [roles]}
    const signOptionAt = {secret: 'AT_SECRET_KEY', expiresIn: 60 * 60}
    const signOptionRt = {secret: 'RT_SECRET_KEY', expiresIn: 60 * 60 * 24 * 7}
    const accessToken = await this.jwt.signAsync(payload, signOptionAt)
    const refreshToken = await this.jwt.signAsync(payload, signOptionRt)
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
  async updateFreshToken(userId: number, refresh_token: string) {
    const hash = await this.hashPassword(refresh_token)
    await this.prisma.user.update({
      where: {id: userId},
      data: {
        hashedRT: hash,
      },
    })
  }
}
