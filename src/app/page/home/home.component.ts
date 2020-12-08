
import { Component, OnInit} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { screen } from "tns-core-modules/platform";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
   
    data=[];
    photoWidth: number = (screen.mainScreen.widthDIPs) * 0.499;
    push:string;
    isBusy:boolean=false;

	constructor(page: Page) {
        page.actionBarHidden = true;
        this.push = ApplicationSettings.getString("push");
    }

    ngOnInit(): void {
        // this.getdata();
       
    }

    getdata(){
        this.isBusy=true;
        request({
            url: "http://www.apitoko.melong.web.id/transaksi/home.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push:this.push
            })
        }).then((response) => {
            const result = response.content.toJSON();
            this.data=result.data;
            console.log(result);
            this.isBusy=false;
        }, (e) => {
        });
    }

    formatDollar(num) {
        var p = Number(num).toFixed(0).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    }

}
