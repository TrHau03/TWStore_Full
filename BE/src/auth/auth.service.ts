import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserInfoService } from "src/userInfo/user.service";
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private userInfoService: UserInfoService,
        
    ) { }
    async signIn(request: any) {
        const { email, password } = request;
        const user = await this.userInfoService.LoginUser({ email });
        let comparePassword = bcrypt.compareSync(password, (await user).password);
        if (!comparePassword) {
            return {
                status: false,
                message: 'Wrong password',
            }
        }
        return {
            user,
            status:true,
        };
    }

}