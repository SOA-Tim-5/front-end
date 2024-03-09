import { User } from "src/app/infrastructure/auth/model/user.model";
import { Facilities } from "./facilities.model";

export interface PublicFacilityRequest {
    Id?: number;
    FacilityId: number;
    Status: PublicStatus;
    Comment?: string;
    Facility?: Facilities;
    Created?: Date;
    AuthorName: string;
    FacilityName?: string;
    Author?: User;
    AuthorPicture?: string;
}

export enum PublicStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
}
