import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "./comment.schema";
import { CommentAddRequestDTO } from "./dto/comment_add_request";
import { CommentResponseDTO } from "./dto/comment_response";
import { CommentGetbyProductResponseDTO } from "./dto/comment_getAll_response";
import { CommentDeleteRequestDTO } from "./dto/comment_delete_request";
import { CommentGetbyProducRequesttDTO } from "./dto/comment_getbyProduct_request";

@Injectable()
export class CommentService {
    constructor(@InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>) { }
    async AddComment(requestDTO: CommentAddRequestDTO): Promise<CommentResponseDTO> {
        try {
            const date = new Date();
            const hour = date.getHours();
            const minutes = date.getMinutes();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            
            const { userID, productID, createAt =  `${hour}:${minutes}, ${day}/${month}/${year}`, content, image, star } = requestDTO;
            const comment = await this.commentModel.findOne({ userID});
            
            if (comment) {
                return {
                    status: false,
                    message: 'Comment already exists',
                }
            }
            const newComment = new this.commentModel({ userID, productID, createAt, content, image, star });
            await newComment.save();
            return {
                status: true,
                message: 'Add Comment successfully',
            }
        } catch (error) {
            console.log(error);
            
            return {
                status: false,
                message: 'Add Comment failed',
            }
        }
    }
    async GetCommentbyIdProduct(requestDTO: CommentGetbyProducRequesttDTO): Promise<CommentGetbyProducRequesttDTO[] | null> {
        try {
            const _id = requestDTO;
            const responseDTO = await this.commentModel.find({ productID: _id })
                .populate([
                    { path: 'userID', select: 'name username avatar' },
                    { path: 'productID', select: 'createAt content image star' }
                ]);
    
            return responseDTO;
        } catch (error) {
            return null;
        }
    }
    
    async DeleteComment(requestDTO: CommentDeleteRequestDTO): Promise<CommentResponseDTO> {
        try {
            const { _id } = requestDTO;
            const comment = await this.commentModel.findByIdAndDelete(_id);
            if (!comment) return {
                status: false,
                message: 'comment not found',
            };
            await this.commentModel.findByIdAndDelete(_id);
            return {
                status: true,
                message: 'Delete comment successfully',
            };
        } catch (error) {
            return {
                status: false,
                message: 'Delete comment failed',
            };
        }
    }
}