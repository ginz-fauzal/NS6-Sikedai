import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { Location } from "@angular/common";
import { request } from "tns-core-modules/http";
import { File } from "tns-core-modules/file-system";
import * as bgHttp from "nativescript-background-http";
import { of, BehaviorSubject } from 'rxjs';
import { sampleTime, concatMap, scan, map } from 'rxjs/operators';
import * as imagepicker from "nativescript-imagepicker";

@Component({
    selector: "Akun",
    moduleId: module.id,
    templateUrl: "./akun.component.html"
})
export class AkunComponent implements OnInit {

    //User
    image:string;
    gambars:boolean=true;
    gambar:string;
    alamat:string;
    email:string; 
    nama:string;
    push:string;
    telepon:string;
    passbaru:string;
    passlama:string;

    // System
    dateTime1: Date = new Date();
    isBusy = false;
    formgp:boolean=false;
    fromProfil:boolean=false; 
    private event = new BehaviorSubject<any>({});
    private session: any;
    showWelcome = true;
    currentFileNameBeingUploaded = "";
    saldo:number=0;
    eventLog = this.event.pipe(
        sampleTime(200),
        concatMap(value => of(value)),
        scan((acc, logEntry) => {
            acc.push(logEntry);
            return acc;
        }, []),
        // emit only logs for the this.currentFileNameBeingUploaded
        map(allLogs => allLogs.filter(logEntry => !!logEntry && logEntry.eventTitle && logEntry.eventTitle.indexOf(this.currentFileNameBeingUploaded) > 0)));

    constructor(private _routerExtensions: RouterExtensions, private location: Location,private page: Page) {
        this.nama=ApplicationSettings.getString("nama");
        this.email=ApplicationSettings.getString("email");
        this.push=ApplicationSettings.getString("push");
        this.gambar=ApplicationSettings.getString("gambar");
        console.log(this.gambar);
        this.session = bgHttp.session("image-upload");
        this.page.actionBarHidden = true;
        this.getdata();
    }

    ngOnInit(): void {
        
    }

    formatDollar(num) {
        var p = Number(num).toFixed(0).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    }

    formgantipassword(){
        this.formgp=true;
    }

    gantipassword(){
        this.isBusy=true;
        request({
            url: "http://apisikedai.melong.web.id/akun/gantipass.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
            passlama: this.passlama,
            passbaru: this.passbaru,
            push:this.push
            })
        }).then((response) => {
            const result = response.content.toJSON();
            this.isBusy=false;
            alert(result.message);
            if(result.success=="1"){
                this.formgp=false;
            }
        }, (e) => {
        });
    }

    logout() {
        this.isBusy=true
        request({
            url: "http://apisikedai.melong.web.id/auth/logout.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push
            }) 
        }).then((response) => {
            const result = response.content.toJSON()
            alert(result.message)
            if(result.success==1){
                ApplicationSettings.remove("authenticated")
                ApplicationSettings.clear()
                this._routerExtensions.navigate(["/login"], { clearHistory: true })
            }
            this.isBusy=false
        }, (e) => {
        })   
    } 

    bukaEdit(){
        this.fromProfil=this.fromProfil ? false:true;
    }

    gantiprofil(){
        this.isBusy=true;
            request({
                url: "http://www.apisikedai.melong.web.id/akun/gantiprofil.php",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                email: this.email,
                nama: this.nama,
                telepon: this.telepon,
                alamat:this.alamat,
                push:this.push,
                image:this.currentFileNameBeingUploaded
                })
            }).then((response) => {
                const result = response.content.toJSON();
                this.isBusy=false;
                if(result.success=="1"){
                    this.currentFileNameBeingUploaded="";
                    ApplicationSettings.remove("gambar");
                    ApplicationSettings.setString("gambar", result.gambar);
                    this.gambar=ApplicationSettings.getString("gambar");
                    this.fromProfil=false;
                }else if(result.success=="2"){
                    ApplicationSettings.remove("nama");
                    ApplicationSettings.setString("nama", result.nama);
                    this.nama=ApplicationSettings.getString("nama");
                    this.fromProfil=false;
                }  
                this.getdata();
                alert(result.message); 
            }, (e) => {
            });
    }

    onSelectImageTap() {
        let context = imagepicker.create({
            mode: "single"
        });
        this.startSelection(context);
    }

    private startSelection(context) {
        context
            .authorize()
            .then(() => {
                return context.present();
            })
            .then((selection) => {
                this.showWelcome = false;

                let imageAsset = selection.length > 0 ? selection[0] : null;

                if (imageAsset) {
                    this.getImageFilePath(imageAsset).then((path) => {
                        this.image=path;
                        this.uploadImage(path);
                    });
                }
            }).catch(function (e) {
                console.log(e);
            });
    }

    private uploadImage(path: string) {
        this.isBusy=true;
        let file = File.fromPath(path);
        this.currentFileNameBeingUploaded = file.path.substr(file.path.lastIndexOf("/") + 1);
        const request = this.createNewRequest();
        request.description = `uploading image ${file.path}`;
        request.headers["File-Name"] = this.currentFileNameBeingUploaded;

        let task = this.session.uploadFile(file.path, request);

        task.on("progress", this.onEvent.bind(this));
        task.on("error", this.onEvent.bind(this));
        task.on("responded", this.onEvent.bind(this));
        task.on("complete", this.onEvent.bind(this));
        this.gambars=false;
    }

    private createNewRequest() {
        const request = {
            url: "http://www.apisikedai.melong.web.id/akun/upload.php",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream"
            },
            description: "uploading file...",
            androidAutoDeleteAfterUpload: false,
        };

        return request;
    }

    private getImageFilePath(imageAsset): Promise<string> {
        return new Promise((resolve) => {
                resolve(imageAsset.android);
        });
    }

    private onEvent(e) {
        if(e.eventName.toString()=="complete"){
            this.isBusy=false;
    }
        this.event.next({
            eventTitle: e.eventName + " " + e.object.description,
            eventData: {
                error: e.error ? e.error.toString() : e.error,
                currentBytes: e.currentBytes,
                totalBytes: e.totalBytes,
                body: e.data,
                raw: JSON.stringify(e) // uncomment for debugging purposes
            }
            
        });
        
    }

    imgmenu(str){
        return str.charAt(0)+str.charAt(1);
    }

    getdata(){
        this.isBusy=true;
        request({
            url: "http://www.apisikedai.melong.web.id/akun/profile.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
            push:this.push
            })
        }).then((response) => {
            const result = response.content.toJSON();
            this.isBusy=false;
            this.alamat=result.alamat;
            this.email=result.email;
            this.telepon=result.telepon;
            this.nama=result.nama;
        }, (e) => {
        });
    }

    batal(){
        this.formgp=false;
        this.fromProfil=false
    }

    
}
