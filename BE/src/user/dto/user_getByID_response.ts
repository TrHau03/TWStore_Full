import { Users } from "../user.entity";

export class UserGetByIDResponseDTO {
    status: boolean;
    message: string;
    data: Users;
}