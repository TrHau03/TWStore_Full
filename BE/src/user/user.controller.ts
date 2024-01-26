import { Controller, Get, Post, Body, Param, Query, Res, HttpStatus, HttpCode, Render, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { Types } from 'mongoose';
import { UserUpdateInfoRequestDTO } from './dto/user_updateInfo_request';
import { UserAddressDTO } from './dto/user_updateAddress_request';
import { UserCart_FavoriteDTO } from './dto/user_updateCart_request';
import { UserGetByIDRequestDTO } from './dto/user_getByID_request';
import { log } from 'console';
//Url: http://localhost:3000/users
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    //Url: http://localhost:3000/users/RegisterUser
    @Get('getAllUsers')
    async GetAllUsers(@Res() res: Response) {
        try {
            const responseDTO = await this.userService.GetAllUsers();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Post('getUser/:id')
    async getUserByID(@Param('id') _id: UserGetByIDRequestDTO, @Body() body: { name: string, email: string }, @Res() res: Response) {
        try {
            const user = await this.userService.GetUserByID({ _id, body });
            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    
    @Post('updateInfoUser')
    async UpdateInfoUser(@Body() body: UserUpdateInfoRequestDTO, @Res() res: Response) {
        
        try {
            const user = await this.userService.UpdateInfoUser(body);
            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }  
    }

    @Post('updateAddressUser')
    async UpdateAddressUser(@Body() body: UserAddressDTO, @Res() res: Response) {
        try {
            const user = await this.userService.UpdateAddressUser(body);
            return res.status(HttpStatus.OK).json(user);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
}
