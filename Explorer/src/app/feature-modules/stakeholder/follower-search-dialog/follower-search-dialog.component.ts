import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { UserFollow } from "../model/user-follow.model";
import { StakeholderService } from "../stakeholder.service";
import { Following } from "../model/following.model";
import { FollowerCreate } from "../model/follower-create.model";
import { UserFollowing } from "../model/user-following.model";
import { UserForFollow } from "../model/user-for-follow.model";
export interface ModalData {
    userId: number;
    username: string;
}
@Component({
    selector: "xp-follower-search-dialog",
    templateUrl: "./follower-search-dialog.component.html",
    styleUrls: ["./follower-search-dialog.component.css"],
})
export class FollowerSearchDialogComponent implements OnInit {
    userId: number;
    faSearch = faSearch;
    users: UserFollow[] = [];
    followings: UserForFollow[] = [];
    searchUsername: string;
    username: string;
    constructor(
        private service: StakeholderService,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
    ) {}

    ngOnInit(): void {
        this.userId = this.data.userId;
        this.username = this.data.username;
        this.loadFollowings();
    }
    loadFollowings() {
        /*this.service.getUserFollowings(this.userId.toString()).subscribe(result => {
            this.followings = result;
        });*/
    }
    follow(id: number) {
        var clicked = this.users.find(u => u.id == id);
        if (clicked != undefined) {
            const following: UserFollowing = {
                UserId: this.userId.toString(),
                Username: this.username,
                Image: "https://img.freepik.com/premium-vector/head-man-profile-avatar-stylish-social-networks_676691-1354.jpg",
                FollowingUserId: clicked.id.toString(),
                FollowingUsername: clicked.username,
                FollowingImage:
                    "https://img.freepik.com/premium-vector/head-man-profile-avatar-stylish-social-networks_676691-1353.jpg",
            };
            this.service.createNewFollowing(following).subscribe({
                next: (result: any) => {
                    if (clicked != undefined) {
                        clicked.followingStatus = true;
                        this.loadFollowings();
                    }
                },
            });
        }
    }
    search() {
        this.service.getSearched(this.searchUsername).subscribe(result => {
            this.users = result.ResponseList;
            this.users.forEach(user => {
                if (this.followings.some(f => user.id.toString() == f.Id)) {
                    user.followingStatus = true;
                } else {
                    user.followingStatus = false;
                }
            });
        });
    }
}
