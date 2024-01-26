import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Promotion, PromotionDocument } from "./promotion.schema";
import { Model } from "mongoose";
import { PromotionInsertDTO } from "./dto/promotion_insert_request";
import { PromotionResponseDTO } from "./dto/promotion_response";
import { PromotionGetResponseDTO } from "./dto/promotion_get_response";
import { PromotionDeleteRequestDTO } from "./dto/promotion_delete_request";

function randomPromotion(): string {
    const length = 6;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}
@Injectable()

export class PromotionService {
    constructor(
        @InjectModel(Promotion.name)
        private readonly promotionModel: Model<PromotionDocument>,
    ) { }

    async addPromotion(requestDTO: PromotionInsertDTO): Promise<PromotionResponseDTO> {
        try {
            const promotionCode = randomPromotion();
    
            const { titleVoucher, contentVoucher, discountLevel, startDay, endDay } = requestDTO;
            const currentDate = new Date();
            // Check if the current date is within the range
            if (currentDate >= new Date(startDay) && currentDate <= new Date(endDay)) {
                const newPromotion = new this.promotionModel({
                    titleVoucher,
                    contentVoucher,
                    discountCode: promotionCode,
                    discountLevel,
                    startDay,
                    endDay
                });
    
                await newPromotion.save();
            } else {
                // If the current date is not within the range, delete the promotion
                await this.promotionModel.deleteOne({ startDay, endDay });
                return {
                    status: false,
                    message: 'Promotion date range is not valid. Promotion deleted.',
                };
            }
    
            return {
                status: true,
                message: 'Add promotion successfully',
            };
        } catch (error) {
            console.error(error);
    
            return {
                status: false,
                message: 'Add promotion failed',
            };
        }
    }

    async getAllPromotion(): Promise<PromotionGetResponseDTO[]> {
        try {
            const response = await this.promotionModel.find();
            return response;
        } catch (error) {
            return
        }
    }
    async getPromotionHighest(): Promise<PromotionGetResponseDTO> {
        try {
            const response = await this.promotionModel.find().sort([['discountLevel', 'desc']]).exec();
            return response[0];
        } catch (error) {
            return
        }
    }
    async DeletePromotion(requestDTO: PromotionDeleteRequestDTO): Promise<PromotionResponseDTO> {
        try {
            const { _id } = requestDTO;
            const promotion = await this.promotionModel.findById(_id);
            if (!promotion) return {
                status: false,
                message: 'Promotion not found',
            };
            await this.promotionModel.findByIdAndDelete(_id);
            return {
                status: true,
                message: 'Delete promotion successfully',
            }
        } catch (error) {
            return {
                status: false,
                message: 'Delete promotion failed',
            }
        }
    }
}