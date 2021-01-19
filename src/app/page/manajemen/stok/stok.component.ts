
import { Component, OnInit} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";
import { confirm,prompt,PromptResult,PromptOptions,inputType, capitalizationType } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules";


@Component({
    selector: "Stok",
    moduleId: module.id,
    templateUrl: "./stok.component.html"
})

export class StokComponent implements OnInit {

    public data = [];
    push:string;
    isBusy:boolean=false;


	constructor(private page: Page) {
        page.actionBarHidden = true;
        this.push = ApplicationSettings.getString("push");
        this.getdata();
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

    public simpan(){
        var success=0;
        this.isBusy=true;
        for(var i in this.data){
            if(this.data[i].jumlah!=0 && (this.data[i].stok+this.data[i].jumlah)>=0){
                request({
                    url: "http://apisikedai.melong.web.id/barang/stokadd.php",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    content: JSON.stringify({
                        push: this.push,
                        id_barang:this.data[i].id_barang,
                        stok:this.data[i].stok+this.data[i].jumlah,
                        aksi:this.data[i].jumlah>0 ? 'tambah':'kurang',
                    })
                }).then((response) => {
                    const result = response.content.toJSON();
                    console.log(result);
                    success+=result.success;
                    if(success==1){
                        alert("Update stok berhasil.");
                    }
                    this.getdata();
                }, () => {
                });
            }
        }
        this.isBusy=false;
        this.getdata();
    }

    public formatDollar(num) {
        var p = Number(num).toFixed(0).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    }

    tambah(index){
        this.data[index].jumlah=this.data[index].jumlah+1;
    }

    kurang(index){
        if((this.data[index].stok+this.data[index].jumlah)>0){
            this.data[index].jumlah=this.data[index].jumlah-1;
        }
    }

    onReturnPress(args,index) {
        // returnPress event will be triggered when user submits a value
        let textField = <TextField>args.object;
        this.data[index].jumlah=Number(textField.text);
        if((this.data[index].stok+this.data[index].jumlah)<0){
            this.data[index].jumlah=this.data[index].stok*-1;
        }
    }

}
