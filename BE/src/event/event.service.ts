import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EventDocument } from "./event.schema";
import { EventInsertDTO } from "./dto/event_insert_request";
import { EventResponseDTO } from "./dto/event_response";
import { EventGetResponseDTO } from "./dto/event_get_response";
import { EventGetbyIdDTO } from "./dto/event_getEventbyID_request";
import uploadImage from 'src/upload/upload';


@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    ) { }
    async addEvent(requestDTO: any): Promise<EventResponseDTO> {
        try {
            const body: EventInsertDTO = requestDTO.body;

            const files = requestDTO.files;
            const url = await uploadImage(files, "Event");
            const { eventName, levelGiamgia, soNgayGiamgia, product } = body;
            const newEvent = new this.eventModel({ eventImage: url, eventName, levelGiamgia, soNgayGiamgia, product });
            await newEvent.save();
            return {
                status: true,
                message: 'Add event successfully',
            }
        } catch (error) {
            console.log(error);

            return {
                status: false,
                message: 'Add event failed',
            }
        }
    }

    async getAllEvent(): Promise<EventGetResponseDTO | any> {
        try {
            const event = await this.eventModel.find().populate('product');
            return event;
        } catch (error) {
            return
        }

    }


    async deleteEvent(_id: Types.ObjectId): Promise<EventResponseDTO> {
        try {
            const { id } = _id;

            await this.eventModel.findByIdAndDelete(id);
            return {
                status: true,
                message: 'Delete event successfull',
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'Delete event failed',
            }
        }
    }




}