import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserInfoDocument, UsersInfo } from './user.schema';
import { UserInsertRequestDTO } from './dto/user_register_request';
import { UserInfoLoginRequestDTO } from './dto/user_login_request';
import { UserInfoForGotRequestDTO } from './dto/user_forgot_request';
import { UserInfoResponseDTO } from './dto/user_response';
import { UserInfoSendMailRequestDTO } from './dto/user_sendmail_request';
import { MailerService } from '@nestjs-modules/mailer';
import { UserChangeUserNameRequestDTO } from './dto/user_changeUserName_request';
import { UserInfoRegisterResponseDTO } from './dto/user_register_response';


enum saltOrRounds {
    SALT = 10
}
enum Email {
    FORM = "The Wonder Store",
    SUBJECT = "Code verify your mail form TheWonderStore ✔",
}



@Injectable()
export class UserInfoService {
    constructor(@InjectModel(UsersInfo.name)
    private readonly userModel: Model<UserInfoDocument>,
        private readonly mailerService: MailerService) { }


    //Hàm insert vào database
    async RegisterUser(requestDTO: UserInsertRequestDTO): Promise<UserInfoRegisterResponseDTO | UserInfoResponseDTO> {
        try {

            const { username, email, password, role } = requestDTO;
            const user = await this.userModel.findOne({ email });
            if (user) {
                return {
                    status: false,
                    message: 'User already exists',
                }
            }
            const hashPassword = await bcrypt.hash(password, saltOrRounds.SALT);
            const newUser = new this.userModel({
                username,
                email,
                password: hashPassword,
                role,
            })

            const { _id } = await newUser.save();
            return {
                status: true,
                message: 'Register successfully ',
                _id: _id

            }
        } catch (error: any) {
            return {
                status: false,
                message: 'Failed' + error,
            }
        }
    }


    async LoginUser(requestDTO: UserInfoLoginRequestDTO): Promise<any | UserInfoResponseDTO> {
        try {
            const { email } = requestDTO;
            const user = await this.userModel.findOne({ email });
            if (!user) {
                return {
                    status: false,
                    message: 'User not found',
                }
            }
            return user;
        } catch (error: any) {
        }
    }

    async ForGotPass(requestDTO: UserInfoForGotRequestDTO): Promise<UserInfoResponseDTO> {
        try {
            const { email, newPassword } = requestDTO;
            const user = await this.userModel.findOne({ email });
            const hashPassword = await bcrypt.hash(newPassword, saltOrRounds.SALT);
            if (user) {
                (await user).password = hashPassword;
                (await user).save();
                return {
                    status: true,
                    message: 'Update password successfully',
                }
            } else {
                return {
                    status: false,
                    message: 'Update password failed',
                }
            }

        } catch (error) {
            return {
                status: false,
                message: 'Update password error',
            }
        }
    }

    async ChangePassword(requestDTO: any): Promise<UserInfoResponseDTO> {
        try {
            const { email, oldPassword, newPassword } = requestDTO;
            const user = await this.userModel.findOne({ email });
            let comparePassword = bcrypt.compareSync(oldPassword, (await user).password);
            if (comparePassword) {
                const hashPassword = await bcrypt.hash(newPassword, saltOrRounds.SALT);
                (await user).password = hashPassword;
                (await user).save();
                return {
                    status: true,
                    message: 'Change password successfully',
                }
            } else {
                return {
                    status: false,
                    message: 'Change password failed',
                }
            }
        } catch (error) {
            return {
                status: false,
                message: 'Change password error',
            }
        }
    }
    async VerifyUser(requestDTO: UserInfoSendMailRequestDTO): Promise<UserInfoResponseDTO | any> {
        try {
            const { email } = requestDTO;
            const random = Math.floor((Math.random() * (999999 - 100000)) + 100000);
            const sendMail = this.mailerService.sendMail({
                to: email, // list of receivers
                from: Email.FORM, // sender address
                subject: Email.SUBJECT, // Subject line
                html: `
                    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                        <div style="margin:50px auto;width:70%;padding:20px 0">
                            <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">The Wonder Store</a>
                            </div>
                            <p style="font-size:1.1em">Hi,</p>
                            <p>Thank you for choosing The Wonder Store. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${random}</h2>
                            <p style="font-size:0.9em;">Regards,<br />The Wonder Store</p>
                            <hr style="border:none;border-top:1px solid #eee" />
                            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Your Brand Inc</p>
                            <p>1600 Amphitheatre Parkway</p>
                            <p>California</p>
                            </div>
                        </div>
                </div>
                `, // HTML body content
            })
            if (sendMail) {
                return {
                    status: true,
                    message: 'SendMail successfully',
                    random,
                }
            } else {
                return {
                    status: false,
                    message: 'SendMail Failed',
                }
            }
        } catch (error) {
            return {
                status: false,
                message: error,
            }
        }
    }


    async UpdateInfoUser(requestDTO: UserInsertRequestDTO | any): Promise<UserInfoResponseDTO> {
        try {
            const { _id, email = null, username = null } = requestDTO;
            const user = await this.userModel.findOne({ _id: _id });

            if (user) {
                user.email = email ? email : user.email;
                user.username = username ? username : user.username;
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

    async GetEmailAllUsersInfor(): Promise<UserInsertRequestDTO[]> {
        try {
            const listEmail: any = await this.userModel.find();
            return listEmail.map(user => user.email);
        } catch (error) {
            return error;
        }
    }
}
