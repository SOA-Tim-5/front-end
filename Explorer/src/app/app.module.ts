import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AppRoutingModule } from "./infrastructure/routing/app-routing.module";
import { AppComponent } from "./app.component";
import { LayoutModule } from "./feature-modules/layout/layout.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./infrastructure/material/material.module";
import { AdministrationModule } from "./feature-modules/administration/administration.module";
import { MarketplaceModule } from "./feature-modules/marketplace/marketplace.module";
import { TourAuthoringModule } from "./feature-modules/tour-authoring/tour-authoring.module";
import { TourExecutionModule } from "./feature-modules/tour-execution/tour-execution.module";
import { AuthModule } from "./infrastructure/auth/auth.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { JwtInterceptor } from "./infrastructure/auth/jwt/jwt.interceptor";
import { BlogModule } from "./feature-modules/blog/blog.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxGoogleAnalyticsModule } from "ngx-google-analytics";
import { StakeholderModule } from "./feature-modules/stakeholder/stakeholder.module";
import { MatCardModule } from "@angular/material/card";
import { EncounterModule } from "./feature-modules/encounter/encounter.module";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { QuillModule } from "ngx-quill";
import { StarRatingModule } from "angular-star-rating";
import { TooltipModule } from "primeng/tooltip";

const notifierConfig: NotifierOptions = {
    position: {
        horizontal: {
            position: "right",
            distance: 12,
        },
        vertical: {
            position: "bottom",
            distance: 12,
            gap: 10,
        },
    },
    theme: "material",
    behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: "pauseAutoHide",
        showDismissButton: true,
        stacking: 4,
    },
    animations: {
        enabled: true,
        show: {
            preset: "slide",
            speed: 300,
            easing: "ease",
        },
        hide: {
            preset: "fade",
            speed: 300,
            easing: "ease",
            offset: 50,
        },
        shift: {
            speed: 300,
            easing: "ease",
        },
        overlap: 150,
    },
};

@NgModule({
    declarations: [AppComponent],

    imports: [
        BrowserModule,
        AppRoutingModule,
        LayoutModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MaterialModule,
        AdministrationModule,
        BlogModule,
        MarketplaceModule,
        TourAuthoringModule,
        TourExecutionModule,
        AuthModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        StakeholderModule,
        FormsModule,
        FontAwesomeModule,
        NgxGoogleAnalyticsModule.forRoot("G-YF6NHGD2NQ"),
        MatCardModule,
        EncounterModule,
        NotifierModule.withConfig(notifierConfig),
        MarketplaceModule,
        QuillModule,
        StarRatingModule.forRoot(),
        TooltipModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
