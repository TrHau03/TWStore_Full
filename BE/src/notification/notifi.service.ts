import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotifiGetResponseDTO } from "./dto/notifi_get_response";
import { Notification, NotificationDocument } from "./notifi.schema";
import { NotificationInsertDTO } from "./dto/notifi_insert_request";


@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(@InjectModel(Notification.name)
    private readonly notifiModel: Model<NotificationDocument>,) { }

    async addNotification(requestDTO: NotificationInsertDTO): Promise<NotifiGetResponseDTO> {
        try {
            console.log(requestDTO);
            const { _idUser, title, content } = requestDTO;
            const newNotifi = new this.notifiModel({
                _idUser,
                title,
                content,
            });

            await newNotifi.save()

            return {
                status: true,
                message: 'Notification added successfully',

            }
        } catch (error) {
            return {
                status: false,
                message: error.message,
            }
        }
    }

    async getAllNotification(_idUser): Promise<NotifiGetResponseDTO | any> {
        try {
            const notifi = await this.notifiModel.find({ _idUser });
            this.logger.log('Get all notifications successfully');
            return notifi;
        } catch (error) {
            this.logger.error(`Failed to get all notifications: ${error.message}`);
            return
        }

    }
}
