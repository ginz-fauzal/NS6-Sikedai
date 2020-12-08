import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";


const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", loadChildren: () => import("~/app/page/login/login.module").then((m) => m.LoginModule) },
    { path: "register", loadChildren: () => import("~/app/page/register/register.module").then((m) => m.RegisterModule) },
    { path: "home", loadChildren: () => import("~/app/page/home/home.module").then((m) => m.HomeModule) },
    { path: "akun", loadChildren: () => import("~/app/page/akun/akun.module").then((m) => m.AkunModule) },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
