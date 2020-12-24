import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { StokComponent } from "./stok.component"; // Import all components that will be used in the lazy loaded module
import { StokRoutingModule } from "./stok.routing"; // import the routing module
import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        StokRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule
    ],
    declarations: [StokComponent], // declare all components that will be used within the module
    providers: [ ] // provide all services that will be used within the module
})
export class StokModule { }