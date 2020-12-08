import { Component} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as ApplicationSettings from "tns-core-modules/application-settings";
const firebase = require("nativescript-plugin-firebase");
import { request } from "tns-core-modules/http";

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html"
})
export class LoginComponent{
  
    email: string="";
    password: string="";
    lupaForm:boolean=false;
    isBusy:boolean=false;
    push:string;

    constructor(private router: RouterExtensions,page: Page) {
        page.actionBarHidden = true;
        var auth=ApplicationSettings.getBoolean("authenticated",false);
        if(auth) {
            this.router.navigate(["/home"], { clearHistory: true });
        }
    }

    ngOnInit(): void {
        firebase.getCurrentPushToken().then((token: string) => {
            this.push=token;
        })
    }

    login() {
        ApplicationSettings.clear();
        this.isBusy=true;
        console.log(this.push);
        request({
                url: "http://apisikedai.melong.web.id/auth/login.php",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    email: this.email, 
                    password: this.password, 
                    push:this.push
                })
            }).then((response) => {
                const result = response.content.toJSON(); 
                this.isBusy=false;
                alert(result.message);
                if(result.success=="1") {
                    ApplicationSettings.setBoolean("authenticated", true);
                    ApplicationSettings.setString("nama", result.nama);
                    ApplicationSettings.setString("email", result.email);
                    ApplicationSettings.setString("push", result.push);
                    ApplicationSettings.setString("gambar", result.gambar);
                    this.router.navigate(["/home"], { clearHistory: true });
                }
            }, (e) => {
        })   
    } 

    lupaOn(){
        this.lupaForm=true;
    }

    lupaOff(){
        this.lupaForm=false;
    }

    kirim(){
        this.isBusy=true
        request({
            url: "http://apisikedai.melong.web.id/auth/lupapass.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                email:this.email
            })
        }).then((response) => {
            const result = response.content.toJSON();
            alert(result.message);
            this.isBusy=false;
            if(result.success=="1"){
                this.lupaOff();
                this.email="";
            }
        }, (e) => {
    })
    }

}
