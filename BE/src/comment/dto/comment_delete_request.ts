import { Types } from "mongoose";

export class CommentDeleteRequestDTO {
    _id: Types.ObjectId;
    userID: Types.ObjectId;
}