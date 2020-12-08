import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { RouterExtensions } from "nativescript-angular/router";
import { request } from "tns-core-modules/http";
import {Page} from "tns-core-modules/ui/page";

@Component({
    selector: "Register",
    moduleId: module.id,
    templateUrl: "./register.component.html"
})
export class RegisterComponent{

    nama: string="";
    email: string="";
    alamat: string="";
    password: string="";
    telepon: string="";
    
    isBusy = false;

    constructor(private router: RouterExtensions, private location: Location,page: Page) {
        page.actionBarHidden = true;
    }

    submit() { 
        if(this.password.length<8 || this.password.length>16){
            alert("Password harus min. 8 karakter dan max. 16 karakter");
        }if(this.telepon.length<11 || this.telepon.length>13){
            alert("Telepon harus min. 11 karakter dan max. 13 karakter");
        }else{
            this.isBusy=true;
            request({
                    url: "http://apisikedai.melong.web.id/auth/register.php",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    content: JSON.stringify({
                        nama: this.nama,
                        telepon:this.telepon, 
                        alamat:this.alamat, 
                        email:this.email, 
                        password:this.password
                    })
                }).then((response) => {
                    const result = response.content.toJSON();
                    this.isBusy=false;
                    if(result.success=="1") {
                        this.router.navigate(["/login"], { clearHistory: true });
                    }
                    alert(result.message);
                }, (e) => {
            }); 
        }
    }

    goBack() {
        this.location.back();
    }

}
