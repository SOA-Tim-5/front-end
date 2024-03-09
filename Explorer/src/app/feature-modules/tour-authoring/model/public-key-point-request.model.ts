import { User } from "src/app/infrastructure/auth/model/user.model";
import { KeyPoint } from "./key-point.model";

export interface PublicKeyPointRequest {
    Id?: number;
    KeyPointId: number;
    Status: PublicStatus;
    Comment?: string;
    KeyPoint?: KeyPoint;
    Created?: Date;
    AuthorName: string;
    KeyPointName?: string;
    Author?: User;
    AuthorUsername?: string;
    AuthorPicture?: string;
}

export enum PublicStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
}
