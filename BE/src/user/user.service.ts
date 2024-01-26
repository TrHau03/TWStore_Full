import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserDocument, Users } from './user.schema';
import { UserResponseDTO } from './dto/user_response';
import { MailerService } from '@nestjs-modules/mailer';
import { UserGetByIDResponseDTO } from './dto/user_getByID_response';
import { UserAddressDTO } from './dto/user_updateAddress_request';
import { UserCart_FavoriteDTO } from './dto/user_updateCart_request';
import { UserUpdateInfoRequestDTO } from './dto/user_updateInfo_request';
import { UserGetByIDRequestDTO } from './dto/user_getByID_request';
import { UserAddIdRequestDTO } from './dto/user_addId_request';
import { UserGetAllResponseDTO } from './dto/user_getAll_response';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';





@Injectable()
export class UserService {
    constructor(@InjectModel(Users.name)
    private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    //Hàm insert vào database
    async GetUserByID(requestDTO: any): Promise<UserGetByIDResponseDTO | any> {
        try {
            const { _id, body } = requestDTO;
            const { name, email } = body;
            const user = await this.userModel.findOne({ _idUser: _id }).populate([{ path: 'cartItem', populate: [{ path: 'productID', model: 'Product', select: ['productName', 'offer', 'price', 'image'] }, { path: 'sizeProduct', model: 'Size' }, { path: 'colorProduct', model: 'Color' }] }]);
            if (user) {
                const payload = { sub: user._id, name: user.name };
                return {
                    status: true,
                    message: 'Get User successfully',
                    data: user,
                    access_token: await this.jwtService.signAsync(payload),
                }
            }
            let newUser = new this.userModel({ _idUser: _id, name, email, phone: null, active: true, avatar: null, cartItem: [], gender: null, birthDay: null, address: [] });
            await newUser.save();
            return {
                status: true,
                message: 'New User',
                data: newUser,
                access_token: await this.jwtService.signAsync({ sub: newUser._id, name: newUser.name }),
            }
        } catch (error) {
            console.log(error);

            return {
                status: false,
                message: 'Get User error',
                data: null,
            }
        }

    }

    async UpdateActiveUser(responseDTO: UserUpdateInfoRequestDTO | any): Promise<UserResponseDTO> {
        try {
            const { _id, active = null } = responseDTO;
            const { id } = _id;
            const user = await this.userModel.findById(id);
            if (!user) {
                return {
                    status: false,
                    message: 'User not found'
                }
            }
            if (active == 'true') {
                user.active = false;
            } else {
                user.active = true;
            }
            await user.save();
            return {
                status: true,
                message: 'Update User successfully'
            }
        } catch (error) {
            console.log(error);
        }
    }

    async UpdateInfoUser(requestDTO: UserUpdateInfoRequestDTO | any): Promise<UserResponseDTO> {
        try {
            const { _id, name = null, phone = null, avatar = null, gender = null, birthDay = null, email = null, cartItem = [] } = requestDTO;
            const user = await this.userModel.findOne({ _idUser: _id });
            if (user) {
                user.name = name ? name : user.name;
                user.phone = phone ? phone : user.phone;
                user.avatar = avatar ? avatar : user.avatar;
                user.gender = gender ? gender : user.gender;
                user.birthDay = birthDay ? birthDay : user.birthDay;
                user.email = email ? email : user.email;
                user.cartItem = cartItem;
                await user.save();
                return {
                    status: true,
                    message: 'Update User successfully'
                }
            }
            return {
                status: false,
                message: 'Update User failed'
            }
        } catch (error) {
            return {
                status: false,
                message: 'Update favoUserrite error'
            }
        }
    }

    async UpdateAddressUser(requestDTO: UserAddressDTO): Promise<UserResponseDTO> {
        try {
            const { _idUser, typeUpdate, position, city, district, ward, street = "" } = requestDTO;
            const user = await this.userModel.findOne({ _idUser });
            if (typeUpdate === "insert") {
                user.address.push({ position: user.address.length + 1, city, district, ward, street });
                await user.save();
                return {
                    status: true,
                    message: 'Add address successfully',
                }
            } else {
                user.address.splice(position - 1, 1);
                await user.save();
                return {
                    status: true,
                    message: 'Delete address successfully',
                }
            }
        } catch (error) {
            console.log(error);

            return {
                status: false,
                message: 'Update address failed',
            }
        }
    }

    async GetAllUsers(): Promise<UserGetAllResponseDTO[]> {
        try {
            const responseDTO = await this.userModel.find();
            return responseDTO;
        } catch (error) {
            return error;
        }
    }
}
