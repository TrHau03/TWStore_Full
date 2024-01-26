import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ProductService } from 'src/product/product.service';
import { Response } from 'express';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly productService: ProductService,
  ) {}

  @Get('getAllEvent')
  async getAllEvent(@Res() res: Response) {
    try {
      const event = await this.eventService.getAllEvent();
      return res.status(HttpStatus.OK).json(event);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

}
