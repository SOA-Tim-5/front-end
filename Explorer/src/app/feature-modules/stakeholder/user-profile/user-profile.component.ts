import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Person } from "../model/person.model";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Router } from "@angular/router";
import { Follower } from "../model/follower.model";
import { MatDialog } from "@angular/material/dialog";
import { faL, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Following } from "../model/following.model";
import { FollowDialogComponent } from "../follow-dialog/follow-dialog.component";
import { StakeholderService } from "../stakeholder.service";
import { FollowerSearchDialogComponent } from "../follower-search-dialog/follower-search-dialog.component";
import { TourExecutionHistoryComponent } from "../../tour-execution/tour-execution-history/tour-execution-history.component";
import * as DOMPurify from "dompurify";
import { marked } from "marked";
import { Wallet } from "../model/wallet.model";
import { UserClubsDialogComponent } from "../user-clubs-dialog/user-clubs-dialog.component";
import { UserForFollow } from "../model/user-for-follow.model";

@Component({
    selector: "xp-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
    editing = false;
    user: User;
    person: Person;
    followers: UserForFollow[] = [];
    followersCount: number;
    followings: UserForFollow[] = [];
    followingsCount: number;
    showFollowers: boolean = false;
    showFollowings: boolean = false;
    bioMarkdown: string;
    wallet: Wallet;
    xp: number;
    level: number;
    faLightbulb = faLightbulb;

    constructor(
        private authService: AuthService,
        private service: StakeholderService,
        private router: Router,
        public dialog: MatDialog,
    ) {}

    toggleEditing() {
        this.router.navigate(["/edit-profile"]);
    }

    ngOnInit(): void {
        const md = marked.setOptions({});
        this.authService.user$.subscribe(user => {
            this.user = user;

            if (!user.id) return;
            this.service.getByUserId(this.user.id).subscribe(result => {
                this.person = result;
                if (this.person.bio)
                    this.bioMarkdown = DOMPurify.sanitize(
                        md.parse(this.person.bio),
                    );
            });
            this.loadFollowers();
            this.loadFollowings();
            this.loadWallet();
        });
        this.authService.user$.subscribe(user => {
            this.xp = user.touristProgress?.Xp || 0;
            this.level = user.touristProgress?.Level || 0;
            console.log(this.xp);
            console.log(this.level);
        });
    }
    loadFollowings() {
        this.service
            .getUserFollowings(this.user.id.toString())
            .subscribe(result => {
                this.followings = result;
                this.followingsCount = this.followings.length;
                this.followings.forEach(item => {
                    item.followingStatus = true;
                });
            });
    }
    loadFollowers() {
        this.service
            .getUserFollowers(this.user.id.toString())
            .subscribe(result => {
                this.followers = result;
                this.followersCount = this.followers.length;
                this.followers.forEach(item => {
                    item.followingStatus = true;
                });
            });
        console.log(this.followers);
    }
    loadWallet() {
        if (this.user.role !== "tourist") {
            return;
        }
        this.service.getTouristWallet().subscribe(result => {
            this.wallet = result;
        });
    }
    openFollowersDialog(): void {
        const dialogRef = this.dialog.open(FollowDialogComponent, {
            data: {
                followers: this.followers,
                followings: this.followings,
                showFollowers: true,
                showFollowings: false,
                user: this.user,
            },
        });
        console.log(this.followers);
        dialogRef.afterClosed().subscribe(item => {
            this.loadFollowers();
        });
    }
    openFollowingsDialog(): void {
        const dialogRef = this.dialog.open(FollowDialogComponent, {
            data: {
                followers: this.followers,
                followings: this.followings,
                showFollowers: false,
                showFollowings: true,
                user: this.user,
            },
        });
        dialogRef.afterClosed().subscribe(item => {
            this.loadFollowings();
        });
    }
    openFollowerSearchDialog(): void {
        const dialogRef = this.dialog.open(FollowerSearchDialogComponent, {
            data: {
                userId: this.user.id,
                username: this.user.username,
            },
        });
        dialogRef.afterClosed().subscribe(item => {
            this.loadFollowings();
            this.loadFollowers();
        });
    }
    goToAllNotifications(): void {
        this.router.navigate(["/user-notifications"]);
    }
    openTourExecutionHistoryDialog(): void {
        const dialogRef = this.dialog.open(TourExecutionHistoryComponent, {
            enterAnimationDuration: "300ms",
            exitAnimationDuration: "200ms",
            height: "500px",
            width: "37rem",
            data: {
                user: this.user,
            },
        });
    }
    openClubsDialog() {
        this.dialog.open(UserClubsDialogComponent, {
            data: {
                userId: this.user.id,
            },
        });
    }
    openFollowersRecommendationDialog() {}
}
