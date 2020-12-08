import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BottomNavigationComponent } from "./komponen/bottom-navigation.component";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptCommonModule,
        NativeScriptAnimationsModule
    ],
    providers: [],
    declarations: [
        AppComponent,
        BottomNavigationComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
