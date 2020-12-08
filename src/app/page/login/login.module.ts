import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { LoginComponent } from "./login.component"; // Import all components that will be used in the lazy loaded module
import { LoginRoutingModule } from "./login.routing"; // import the routing module

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        LoginRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule
    ],
    declarations: [LoginComponent], // declare all components that will be used within the module
    providers: [ ] // provide all services that will be used within the module
})
export class LoginModule { }