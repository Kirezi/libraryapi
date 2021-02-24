import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { AuthChildrenGuard } from "./guards/auth-children.guard";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "libraries", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "members",
    loadChildren: "./members/members.module#MembersModule",
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildrenGuard],
  },
  {
    path: "libraries",
    loadChildren: "./library/library.module#LibraryModule",
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildrenGuard],
  },
  {
    path: "checked-out",
    loadChildren: "./checked-out/checked-out.module#CheckedOutModule",
    canActivate: [AuthGuard],
    canActivateChild: [AuthChildrenGuard],
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {
  // constructor(router: Router) {
  //   router.config.filter(route => !route.data || !route.data.skipGuard).map(route => this.addGuard(route));
  // }
  // private addGuard(route: Route): void {
  //   route.canActivate = [AuthGuard].concat(route.canActivate);
  //   route.canActivateChild = [AuthGuard].concat(route.canActivateChild);
  // }
}
