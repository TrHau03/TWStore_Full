import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Color, ColorDocument } from "./color.schema";
import { Model } from "mongoose";
import { ColorGetAllResponseDTO } from "./dto/color_getAll_response";
import { ColorAddRequestDTO } from "./dto/color_add_request";
import { ColorResponseDTO } from "./dto/color_response";
import { ColorDeleteRequestDTO } from "./dto/color_delete_request";

@Injectable()
export class ColorService {
    constructor(@InjectModel(Color.name)
    private readonly ColorModel: Model<ColorDocument>) { }
    async AddColor(requestDTO: ColorAddRequestDTO): Promise<ColorResponseDTO> {
        try {
            const { name, code } = requestDTO;
            const Color = await this.ColorModel.findOne({ name });
            if (Color) {
                return {
                    status: false,
                    message: 'Color already exists',
                }
            }

            const newColor = new this.ColorModel({ name, code });
            await newColor.save();
            return {
                status: true,
                message: 'Add Color successfully',
            }
        } catch (error) {
            console.log(error);

            return {
                status: false,
                message: 'Add Color failed',
            }
        }
    }
    async GetAllColor(): Promise<ColorGetAllResponseDTO[]> {
        try {
            const responseDTO = await this.ColorModel.find();
            return responseDTO;
        } catch (error) {
            return error;
        }
    }
    async DeleteColor(requestDTO: any): Promise<ColorResponseDTO> {
        try {
            const { id }: ColorDeleteRequestDTO = requestDTO;

            const Color = await this.ColorModel.findById(id);
            if (!Color) return {
                status: false,
                message: 'Color not found',
            };
            await this.ColorModel.findByIdAndDelete(id);
            return {
                status: true,
                message: 'Delete Color successfully',
            }
        } catch (error) {
            return {
                status: false,
                message: 'Delete Color failed',
            }
        }
    }


}