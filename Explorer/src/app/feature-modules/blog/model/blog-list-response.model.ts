import { UserFollowing } from "../../stakeholder/model/user-following.model";
import { Blog } from "./blog.model";
import { Blog2 } from "./blog2.model";

export interface BlogListResponse {
    Response : Blog2[],
    Following: UserFollowing[]
}