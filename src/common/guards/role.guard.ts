import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {Role} from 'src/database/enum'
import {ROLES_KEY} from '../decorators'
import * as jwt from 'jsonwebtoken'
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const token = request.get('authorization').replace('Bearer', '').trim()
    const user = jwt.verify(token, 'AT_SECRET_KEY')
    return requiredRoles.some((role) => user['roles'].includes(role))
  }
}
