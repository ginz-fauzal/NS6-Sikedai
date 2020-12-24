
import { Component, OnInit} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { screen } from "tns-core-modules/platform";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";
import { Menu } from "nativescript-menu";
import { confirm } from "tns-core-modules/ui/dialogs";
import { File } from "tns-core-modules/file-system";
import * as bgHttp from "nativescript-background-http";
import { of, BehaviorSubject } from 'rxjs';
import { sampleTime, concatMap, scan, map } from 'rxjs/operators';
import * as imagepicker from "nativescript-imagepicker";


@Component({
    selector: "Barang",
    moduleId: module.id,
    templateUrl: "./barang.component.html"
})

export class BarangComponent implements OnInit {
   
    public data = [];
    public datakategori = [];
    form:boolean=false;
    edit:boolean=false;
    push:string;
    isBusy:boolean=false;

    // barang
    id_barang:string;
    nama_barang:string;
    harga_dasar:string;
    harga_jual:string;
    keterangan:string;
    kategori:string;
    id_kategori:string;
    gambar:string;

    // uploadgambar
    setgambar:boolean=true;
    private event = new BehaviorSubject<any>({});
    private session: any;
    showWelcome = true;
    currentFileNameBeingUploaded = "";
    eventLog = this.event.pipe(
        sampleTime(200),
        concatMap(value => of(value)),
        scan((acc, logEntry) => {
            acc.push(logEntry);
            return acc;
        }, []),
        // emit only logs for the this.currentFileNameBeingUploaded
        map(allLogs => allLogs.filter(logEntry => !!logEntry && logEntry.eventTitle && logEntry.eventTitle.indexOf(this.currentFileNameBeingUploaded) > 0)));


	constructor(private page: Page) {
        page.actionBarHidden = true;
        this.session = bgHttp.session("image-upload");
        this.push = ApplicationSettings.getString("push");
        this.getdata();
        this.getkategori();
    }

    ngOnInit(): void {

    }


    public getdata(){
        this.isBusy=true;
        request({
            url: "http://apisikedai.melong.web.id/barang/barang.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push,
            })
        }).then((response) => {
            const result = response.content.toJSON();
            this.data=result.data;
            console.log(result)
            this.isBusy=false;
        }, () => {
        });
    }

    public getkategori(){
        this.isBusy=true;
        request({
            url: "http://apisikedai.melong.web.id/barang/kategori.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push,
            })
        }).then((response) => {
            const result = response.content.toJSON();
            this.datakategori=result.data;
            console.log(result)
            this.isBusy=false;
        }, () => {
        });
    }

    public simpan(){
        this.isBusy=true; 
        request({
            url: "http://apisikedai.melong.web.id/barang/barangadd.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push,
                nama_barang:this.nama_barang,
                harga_dasar:this.harga_dasar,
                harga_jual:this.harga_jual,
                keterangan:this.keterangan,
                id_kategori:this.id_kategori,
                gambar:this.currentFileNameBeingUploaded,
            })
        }).then((response) => {
            const result = response.content.toJSON();
            console.log(result);
            alert(result.message);
            if(result.success==1){
                this.formClose();
                this.getdata();
            }
            this.isBusy=false;
        }, () => {
        });
    }

    public update(){
        this.isBusy=true;
        request({
            url: "http://apisikedai.melong.web.id/barang/barangupdate.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push,
                id_barang:this.id_barang,
                nama_barang:this.nama_barang,
                harga_dasar:this.harga_dasar,
                harga_jual:this.harga_jual,
                keterangan:this.keterangan,
                id_kategori:this.id_kategori,
                gambar:this.currentFileNameBeingUploaded,
            })
        }).then((response) => {
            const result = response.content.toJSON();
            console.log(result);
            alert(result.message);
            if(result.success==1){
                this.formClose();
                this.getdata();
            }
            this.isBusy=false;
        }, () => {
        });
    }

    public hapusdata(id){
        this.isBusy=true;
        request({
            url: "http://apisikedai.melong.web.id/barang/barangdel.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push,
                id_barang: id
            })
        }).then((response) => {
            const result = response.content.toJSON();
            alert(result.message);
            this.getdata();
        }, () => {
        });
    }

    public formatDollar(num) {
        var p = Number(num).toFixed(0).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    }

    formShow(){
        this.form=true;
    }

    formClose(){
        this.form=false;
        this.edit=false;
        this.id_barang="";
        this.nama_barang="";
        this.harga_dasar="";
        this.harga_jual="";
        this.keterangan="";
        this.id_kategori="";
        this.kategori="";
        this.currentFileNameBeingUploaded="";
    }

    public buttonTap() {
        console.log("tes")
        Menu.popup({
            view: this.page.getViewById("menuBtn"),
            actions: this.datakategori
        })
        .then(action => {
			this.id_kategori = action.id_kategori;
            this.kategori = action.title
        })
        .catch(console.log)
    }

    editdata(id){
        for(var i in this.data){
            if(this.data[i].id_barang==id){
                this.id_barang=this.data[i].id_barang;
                this.nama_barang=this.data[i].nama_barang;
                this.harga_dasar=this.data[i].harga_dasar;
                this.harga_jual=this.data[i].harga_jual;
                this.keterangan=this.data[i].keterangan;
                this.id_kategori=this.data[i].id_kategori;
                this.kategori=this.data[i].kategori;
                this.currentFileNameBeingUploaded="";
                this.edit=true;
                this.formShow();
                break;
            }
        }
    }

    barangtap(id){
        confirm({
            title: "Aksi",
            message: "Menu pengaturan barang.",
            okButtonText: "Edit",
            cancelButtonText: "Hapus",
            neutralButtonText: "Tutup"
        }).then(pushAllowed => {
            if(pushAllowed==true){
                this.editdata(id);
            }
            if(pushAllowed==false){
                confirm({
                    title: "Aksi",
                    message: "Ada yakin ingin menghapus data ini?",
                    okButtonText: "Ya",
                    cancelButtonText: "Tidak",
                }).then(pushAllowed => {
                    if(pushAllowed){
                        this.hapusdata(id);
                    }
                });
            }
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
                        this.gambar=path;
                        this.isBusy=true;
                        this.uploadImage(path);
                    });
                }
            }).catch(function (e) {
                console.log(e);
            });
    }

    private uploadImage(path: string) {
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
        this.setgambar=false;
    }

    private createNewRequest() {
        const request = {
            url: "http://www.apisikedai.melong.web.id/barang/upload.php",
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

    public onEvent(e) {
        var cek=e.eventName.toString();
        if(cek=="complete"){
            console.log(cek);
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

}
