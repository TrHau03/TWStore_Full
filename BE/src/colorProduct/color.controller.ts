import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { ColorService } from "./color.service";
import { Response } from "express";
import { ColorAddRequestDTO } from "./dto/color_add_request";
import { ColorDeleteRequestDTO } from "./dto/color_delete_request";

@Controller('color')
export class ColorController {
    constructor(private readonly ColorService: ColorService) { }

    

    @Get('getAllColor')
    async GetAllColor(@Res() res: Response) {
        try {
            const responseDTO = await this.ColorService.GetAllColor();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);

        }
    }

}