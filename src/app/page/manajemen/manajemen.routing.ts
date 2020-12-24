import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ManajemenComponent } from "./manajemen.component";

export const routes: Routes = [
    {
        path: "",
        component: ManajemenComponent
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],  // set the lazy loaded routes using forChild
    exports: [NativeScriptRouterModule]
})
export class ManajemenRoutingModule { }