import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
// import {ConfigService} from '@nestjs/config'

type JwtPayload = {
  sub: string
  email: string
}

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'AT_SECRET_KEY',
      //   secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: JwtPayload) {
    return payload
  }
}
