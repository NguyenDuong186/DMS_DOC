import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
// import {ConfigService} from '@nestjs/config'
import {Request} from 'express'
// import { jwtConstants } from './constants'

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: 'RT_SECRET_KEY',
      //   secretOrKey: jwtConstants.secret,
    })
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim()
    return {
      ...payload,
      refreshToken,
    }
  }
}
