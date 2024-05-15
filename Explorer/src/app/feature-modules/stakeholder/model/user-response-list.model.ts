import { User } from "src/app/infrastructure/auth/model/user.model";
import { UserFollow } from "./user-follow.model";

export interface UserResponseList {
    ResponseList: UserFollow[]
}