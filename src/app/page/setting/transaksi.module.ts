import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { TransaksiComponent } from "./transaksi.component"; // Import all components that will be used in the lazy loaded module
import { TransaksiRoutingModule } from "./transaksi.routing"; // import the routing module

@NgModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NativeScriptCommonModule,
        TransaksiRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIChartModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule
    ],
    declarations: [TransaksiComponent], // declare all components that will be used within the module
    providers: [ ] // provide all services that will be used within the module
})
export class TransaksiModule { }