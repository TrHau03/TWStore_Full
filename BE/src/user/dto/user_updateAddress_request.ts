import { Types } from "mongoose";

export class UserAddressDTO {
    _idUser: string;
    typeUpdate: "insert" | "delete";
    position: number;
    emailUser: string;
    city: string;
    district: string;
    ward: string;
    street: string;
}