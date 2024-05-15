import { Component, Inject, OnInit } from "@angular/core";
import { UserFollowing } from "../model/user-following.model";
import { StakeholderService } from "../stakeholder.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserForFollow } from "../model/user-for-follow.model";

export interface ModalData {
    userId: number;
    username: string;
}
@Component({
    selector: "xp-followers-recommendation",
    templateUrl: "./followers-recommendation.component.html",
    styleUrls: ["./followers-recommendation.component.css"],
})
export class FollowersRecommendationComponent implements OnInit {
    users: UserForFollow[] = [];
    userId: number;
    username: string;

    constructor(
        private service: StakeholderService,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
    ) {}

    ngOnInit(): void {
        this.userId=this.data.userId;
        this.username=this.data.username;
        this.service
            .getFollowerRecommendations(this.userId.toString())
            .subscribe(result => {
                this.users = result.ResponseList;
            });
    }

    follow(id: string) {
        var clicked = this.users.find(u => u.Id == id);
        if (clicked != undefined) {
            const following: UserFollowing = {
                UserId: this.userId.toString(),
                Username: this.username,
                Image: "https://img.freepik.com/premium-vector/head-man-profile-avatar-stylish-social-networks_676691-1354.jpg",
                FollowingUserId: clicked.Id.toString(),
                FollowingUsername: clicked.Username,
                FollowingImage:
                    "https://img.freepik.com/premium-vector/head-man-profile-avatar-stylish-social-networks_676691-1353.jpg",
            };
            this.service.createNewFollowing(following).subscribe({
                next: (result: any) => {
                    if (clicked != undefined) {
                        clicked.FollowingStatus = true;
                        // this.loadFollowings();
                    }
                    this.service
                        .getFollowerRecommendations(this.userId.toString())
                        .subscribe(result => {
                            this.users = result.ResponseList;
                        });
                },
            });
        }
    }
}
