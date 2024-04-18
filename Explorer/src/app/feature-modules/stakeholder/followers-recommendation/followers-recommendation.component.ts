import { Component, OnInit } from "@angular/core";
import { UserFollow } from "../model/user-follow.model";

@Component({
    selector: "xp-followers-recommendation",
    templateUrl: "./followers-recommendation.component.html",
    styleUrls: ["./followers-recommendation.component.css"],
})
export class FollowersRecommendationComponent implements OnInit {
    users: UserFollow[] = [];

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}
