import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { LaptransaksiComponent } from "./laptransaksi.component"; // Import all components that will be used in the lazy loaded module
import { LaptransaksiRoutingModule } from "./laptransaksi.routing"; // import the routing module
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NativeScriptDateTimePickerModule } from "nativescript-datetimepicker/angular";

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        LaptransaksiRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule,
        NativeScriptUIChartModule,
        NativeScriptDateTimePickerModule
    ],
    declarations: [LaptransaksiComponent], // declare all components that will be used within the module
    providers: [ ] // provide all services that will be used within the module
})
export class LaptransaksiModule { }