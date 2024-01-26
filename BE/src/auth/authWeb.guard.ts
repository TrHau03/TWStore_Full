import { ExecutionContext, Injectable, CanActivate, Next } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated() ? request.isAuthenticated() : request.res.redirect('/auth/loginWeb');
    }
}