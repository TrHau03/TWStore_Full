import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Payment, PaymentSchema } from "./payment.schema";
import { PaymentController } from "./payment.controller";
import { PaymentCpanelController } from "./payment.cpanel.controller";
import { PaymentService } from "./payment.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payment.name, schema: PaymentSchema },
        ]),
    ],
    controllers: [PaymentController, PaymentCpanelController],
    providers: [PaymentService],
})
export class PaymentModule { }