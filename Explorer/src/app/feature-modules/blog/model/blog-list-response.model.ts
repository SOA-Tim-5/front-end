import { UserFollowing } from "../../stakeholder/model/user-following.model";
import { Blog } from "./blog.model";

export interface BlogListResponse {
    BlogResponseDto : Blog[],
    Following: UserFollowing[]
}