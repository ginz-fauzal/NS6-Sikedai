
import { Component, OnInit} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { screen } from "tns-core-modules/platform";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";

@Component({
    selector: "Manajemen",
    moduleId: module.id,
    templateUrl: "./manajemen.component.html"
})

export class ManajemenComponent implements OnInit {
   
    push:string;
    isBusy:boolean=false;

	constructor(page: Page) {
        page.actionBarHidden = true;
        this.push = ApplicationSettings.getString("push");
    }

    ngOnInit(): void {
    }

    belumada(){
        alert("Maaf menu ini belum tersedia.")
    }

}
