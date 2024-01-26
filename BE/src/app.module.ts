import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { UserInfoModule } from './userInfo/user.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { PromotionModule } from './promotion/promotion.module';
import { ColorModule } from './colorProduct/color.module';
import { SizeModule } from './size/size.module';
import { BannerModule } from './banner/banner.module';
import { EventModule } from './event/event.module';
import { PaymentModule } from './paymentMethod/payment.module';
import { NotificationModule } from './notification/notifi.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [

    MongooseModule.forRoot('mongodb+srv://admin:haunho@cluster0.3oqlz8r.mongodb.net/TWStore?retryWrites=true&w=majority'),
    UserModule, UserInfoModule, CommentModule, BrandModule, CategoryModule, ProductModule, PromotionModule,
    OrderModule, ColorModule, SizeModule, BannerModule, EventModule, PaymentModule, NotificationModule, AuthModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
