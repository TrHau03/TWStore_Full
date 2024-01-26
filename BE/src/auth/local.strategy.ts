import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInfoResponseDTO } from 'src/userInfo/dto/user_response';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email', // Set the field to 'email'
            passwordField: 'password', // Set the field to 'password'
        });
    }

    async validate(email: string, password: string) {
        const user: UserInfoResponseDTO | any = await this.authService.signIn({ email, password });
        if (user.user.role === 'admin') {
            return user;
        }
        return null;

    }
}