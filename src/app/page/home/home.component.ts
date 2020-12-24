
import { Component, OnInit} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { screen } from "tns-core-modules/platform";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";
import { confirm } from "tns-core-modules/ui/dialogs";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
   
    data=[];
    datapilih=[];
    bayaran:string="0";
    bayar:boolean=false;
    kembalian:number=0;
    total:number=0;
    jumlah:number=0;
    push:string;
    isBusy:boolean=false;

	constructor(page: Page) {
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
 
    formatDollar(num) {
        var p = Number(num).toFixed(0).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    }
    
    tambah(index){
        if(this.data[index].stok>this.data[index].jumlah){
            this.data[index].jumlah=this.data[index].jumlah+1;
        }else{
            alert("Stok yang tersedia hanya "+this.data[index].stok);
        }
        this.totalcek();
    }

    kurang(index){
        if(this.data[index].jumlah>0){
            this.data[index].jumlah=this.data[index].jumlah-1;
        }
        this.totalcek();
    }

    totalcek(){
        this.jumlah=0;
        this.total=0;
        for(var i in this.data){
            this.jumlah+=this.data[i].jumlah;
            this.total+=this.data[i].jumlah*this.data[i].harga_jual;
        }
    }

    next(){
        this.datapilih=[];
        for(var i in this.data){
            if(this.data[i].jumlah>0){
                this.datapilih.push(this.data[i]);
            }
        }
        if(this.datapilih.length==0){
            alert("Anda belum memilih pesanan.")
        }else{
            this.bayar=true;
        }
    }

    numbertap(text:string){
        if(this.bayaran=="0"){
            this.bayaran=text;
        }else{
            this.bayaran=this.bayaran+text;
        }
    }

    hapus(){
        this.bayaran=this.bayaran.substring(0, this.bayaran.length - 1);
    }

    detail(){
        var messages="";
        for(var i in this.datapilih){
            messages=messages+this.datapilih[i].nama_barang+"\n"+this.datapilih[i].jumlah+"x"+this.datapilih[i].harga_jual+" = Rp "+(this.datapilih[i].jumlah*this.datapilih[i].harga_jual)+"\n\n";
        }
        confirm({
            title: "Detail Pesanan",
            message: messages,
            okButtonText: "Ok",
        }).then(pushAllowed => {

        });
    }

    kembali(){
        this.bayar=false;
        this.bayaran="0";
        this.total=0;
        this.jumlah=0;
        this.getdata();
    }

    public bayarkan(){
        this.isBusy=true;
        if(Number(this.bayaran)>=this.total){
            request({
                url: "http://apisikedai.melong.web.id/transaksi/transaksiadd.php",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    push: this.push,
                    data: this.datapilih,
                })
            }).then((response) => {
                const result = response.content.toJSON();
                console.log(result);
                this.isBusy=false;
                if(result.success==1){
                    this.kembalian=Number(this.bayaran)-this.total;
                    confirm({
                        title: "Transaksi Berhasi",
                        message: "Kembalian : Rp "+this.formatDollar(this.kembalian),
                        okButtonText: "Ok",
                    }).then(pushAllowed => {
                        this.kembali();
                    });
                }
            }, () => {
            });
        }else{
            alert("Nominal harus lebih dari total pembayaran.");
            this.isBusy=false;
        }
        
    }

}
