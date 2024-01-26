import { Body, Controller, Get, HttpCode, Post, UseGuards, HttpStatus, Res, Render, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { UserInfoLoginRequestDTO } from "src/userInfo/dto/user_login_request";
import { UserInfoResponseDTO } from "src/userInfo/dto/user_response";
import { Response, Request } from "express";
import { LoginGuard } from "./login.guard";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto);
    }

    @Get('loginWeb')
    @Render('login')
    async home(@Res() res: Response) {
        return {
            message: 'Hello',
        };
    }

    @UseGuards(LoginGuard)
    @Post('loginWeb')
    async Login(@Req() req: Request, @Body() body: UserInfoLoginRequestDTO, @Res() res: Response) {
        res.redirect('/usersCpanel/index');
    }

}