import { Component, OnInit } from "@angular/core";
import { StakeholderService } from "../stakeholder.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { PersonUpdate } from "../model/person-update.model";
import { Person } from "../model/person.model";

@Component({
    selector: "xp-edit-profile",
    templateUrl: "./edit-profile.component.html",
    styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
    person: PersonUpdate;
    constructor(
        private service: StakeholderService,
        private router: Router,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.service.getByUserId(user.id).subscribe((result: Person) => {
                this.person = result;
                this.person.profilePicture = result.user.profilePicture;
            });
        });
    }

    editProfile() {
        this.service.updatePerson(this.person).subscribe(result => {
            console.log("Profile updated:", result);
            this.router.navigate(["/profile"]);
        });
    }
}
