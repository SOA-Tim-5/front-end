import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { StakeholderService } from "../stakeholder.service";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogComponent } from "../message-dialog/message-dialog/message-dialog.component";
import { Person } from "../model/person.model";
import {
    faEnvelope,
    faUserCheck,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { UserForFollow } from "../model/user-for-follow.model";

@Component({
    selector: "xp-user-row",
    templateUrl: "./user-row.component.html",
    styleUrls: ["./user-row.component.css"],
})
export class UserRowComponent {
    currentUserId: number;
    @Input() user: UserForFollow;
    @Input() person: Person;
    @Input() followId: number;
    @Input() followStatus: boolean | undefined;
    @Input() enableFollow: boolean = false;
    @Output() unfollowOrFollowEvent = new EventEmitter<number>();

    faEnvelope = faEnvelope;
    faUserPlus = faUserPlus;
    faUserCheck = faUserCheck;

    constructor(public dialog: MatDialog) {}

    openMessageDialog(reciverID: number): void {
        this.dialog.open(MessageDialogComponent, {
            data: {
                userId: this.currentUserId,
                reciverId: reciverID,
            },
        });
    }

    unfollowOrFollow(id: number): void {
        this.unfollowOrFollowEvent.emit(id);
    }
}
