import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CheckedOutModule } from "../checked-out/checked-out.module";
import { LibraryMatModule } from "./../library-mat.module";
import { MemberBookListComponent } from "./member-book-list/member-book-list.component";
import { MemberDetailsComponent } from "./member-details/member-details.component";
import { MemberListComponent } from "./member-list/member-list.component";
import { MembersRoutingModule } from "./members-routing.module";
@NgModule({
  imports: [
    CommonModule,
    MembersRoutingModule,
    LibraryMatModule,
    CheckedOutModule,
  ],
  exports: [MemberListComponent, MemberDetailsComponent, LibraryMatModule],
  declarations: [
    MemberListComponent,
    MemberDetailsComponent,
    MemberBookListComponent,
  ],
})
export class MembersModule {}
