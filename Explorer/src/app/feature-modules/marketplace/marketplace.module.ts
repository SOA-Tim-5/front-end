import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { MatChipsModule } from "@angular/material/chips";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ReactiveFormsModule } from "@angular/forms";
import { RatingFormComponent } from "./rating-form/rating-form.component";
import { RouterModule } from "@angular/router";
import { OwnerClubsComponent } from "./owner-clubs/owner-clubs.component";
import { ClubFormComponent } from "./club-form/club-form.component";
import { ClubsComponent } from "./clubs/clubs.component";
import { MyClubJoinRequestsComponent } from "./my-club-join-requests/my-club-join-requests.component";
import { ClubJoinRequestManagementComponent } from "./club-join-request-management/club-join-request-management.component";
import { ReviewComponent } from "./review/review.component";
import { ReviewFormComponent } from "./review-form/review-form.component";
import { ProblemFormComponent } from "./problem-form/problem-form.component";
import { ClubMembersInviteFormComponent } from "./club-members-invite-form/club-members-invite-form.component";
import { ClubMembersManagementComponent } from "./club-members-management/club-members-management.component";
import { TourSearchComponent } from "./tour-search/tour-search.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LayoutModule } from "src/app/feature-modules/layout/layout.module";
import { KeypointsNotificationsComponent } from "./keypoints-notifications/keypoints-notifications.component";
import { FacilitiesNotificationsComponent } from "./facilities-notifications/facilities-notifications.component";
import { MyClubInvitationsComponent } from "./my-club-invitations/my-club-invitations.component";
import { TourPreferencesComponent } from "./tour-preferences/tour-preferences.component";
import { TourPreferenceFormComponent } from "./tour-preference-form/tour-preference-form.component";
import { BrowserModule } from "@angular/platform-browser";
import { TagInputModule } from "ngx-chips";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { TourDetailsComponent } from "./tour-details/tour-details.component";
import { FullSizeImageComponent } from "./full-size-image/full-size-image.component";
import { TourPageComponent } from "./tour-page/tour-page.component";
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { TourSalesComponent } from "./tour-sales/tour-sales.component";
import { TourSaleFormComponent } from "./tour-sale-form/tour-sale-form.component";
import { CouponsComponent } from "./coupons/coupons.component";
import { CouponsViewComponent } from "./coupons-view/coupons-view.component";
import { EditCouponFormComponent } from "./edit-coupon-form/edit-coupon-form.component";
import { CouponsModalComponent } from "./coupons-modal/coupons-modal.component";
import { ExploreBundlesComponent } from "./explore-bundles/explore-bundles.component";
import { StarRatingModule } from "angular-star-rating";
import { ClubPageComponent } from "./club-page/club-page.component";
import { ClubBlogPreviewComponent } from "./club-blog-preview/club-blog-preview.component";
import { BlogsComponent } from "../blog/blogs/blogs.component";
import { BlogModule } from "../blog/blog.module";
import { TouristsWishlistComponent } from "./tourists-wishlist/tourists-wishlist.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { CartComponent } from "./cart/cart.component";
import { MatRadioModule } from "@angular/material/radio";
import { NotifierModule } from "angular-notifier";

@NgModule({
    declarations: [
        OwnerClubsComponent,
        ClubFormComponent,
        ClubsComponent,
        MyClubJoinRequestsComponent,
        ClubJoinRequestManagementComponent,
        ReviewComponent,
        ReviewFormComponent,
        ProblemFormComponent,
        RatingFormComponent,
        ClubFormComponent,
        ClubsComponent,
        OwnerClubsComponent,
        ClubMembersInviteFormComponent,
        ClubMembersManagementComponent,
        MyClubInvitationsComponent,
        TourPreferencesComponent,
        TourPreferenceFormComponent,
        TourSearchComponent,
        KeypointsNotificationsComponent,
        FacilitiesNotificationsComponent,
        TourDetailsComponent,
        FullSizeImageComponent,
        TourPageComponent,
        TourSalesComponent,
        TourSaleFormComponent,
        CouponsComponent,
        CouponsViewComponent,
        EditCouponFormComponent,
        CouponsModalComponent,
        ExploreBundlesComponent,
        ClubPageComponent,
        ClubBlogPreviewComponent,
        TouristsWishlistComponent,
        WishlistComponent,
        CartComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        DragDropModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        BrowserModule,
        TagInputModule,
        BrowserAnimationsModule,
        SharedModule,
        FontAwesomeModule,
        FormsModule,
        LayoutModule,
        MatChipsModule,
        TourAuthoringModule,
        BlogModule,
        MatRadioModule,
        StarRatingModule.forRoot(),
        NotifierModule,
    ],
    exports: [
        ReviewComponent,
        ReactiveFormsModule,
        RatingFormComponent,
        TourPreferencesComponent,
        TourPreferenceFormComponent,
        KeypointsNotificationsComponent,
        FacilitiesNotificationsComponent,
        CouponsModalComponent,
        CartComponent,
    ],
})
export class MarketplaceModule {}
