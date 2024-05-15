import { User } from "src/app/infrastructure/auth/model/user.model";
import { Comment } from "./comment.model";
import { Vote } from "./vote.model";

export interface Blog2 {
    Id: number;
    Title: string;
    Description: string;
    Date: string;
    Status: number;
    Comments: Comment[];
    VoteCount: number;
    Votes: Vote[];
    AuthorId: number;
    Author: User;
    VisibilityPolicy: number;
    ShowMore?: boolean;
}