import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { ManajemenComponent } from "./manajemen.component"; // Import all components that will be used in the lazy loaded module
import { ManajemenRoutingModule } from "./manajemen.routing"; // import the routing module
import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        ManajemenRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule
    ],
    declarations: [ManajemenComponent], // declare all components that will be used within the module
    providers: [ ] // provide all services that will be used within the module
})
export class ManajemenModule { }