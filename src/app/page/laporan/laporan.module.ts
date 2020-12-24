import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { LaporanComponent } from "./laporan.component"; // Import all components that will be used in the lazy loaded module
import { LaporanRoutingModule } from "./laporan.routing"; // import the routing module
import { NativeScriptFormsModule } from "nativescript-angular/forms";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        LaporanRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule
    ],
    declarations: [LaporanComponent], // declare all components that will be used within the module
    providers: [ ] // provide all services that will be used within the module
})
export class LaporanModule { }