import { Component, OnInit} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";
import { confirm } from "tns-core-modules/ui/dialogs";
import { Hprt, HPRTPrinter } from "nativescript-hprt";
import { TextField } from "tns-core-modules/ui/text-field";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    // Printer
    private hprt: Hprt;
    struk=[];
    indexstruk=0;
    print=[];
    data:any;
    datatemp:any;
    datapilih=[];
    bayaran:string="0";
    bayar:boolean=false;
    kembalian:number=0;
    total:number=0;
    jumlah:number=0;
    push:string;
    isBusy:boolean=false;
    cari:string="";

	constructor(page: Page) {
        page.actionBarHidden = true;
        this.hprt = new Hprt();
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
            this.datatemp=result.data;
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
                if(this.data[i].jumlah<=this.data[i].stok){
                    this.datapilih.push(this.data[i]);
                }else{
                    this.data[i].jumlah=0;
                }
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
                    bayar:Number(this.bayaran),
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
                        okButtonText: "Print",
                        cancelButtonText: "Ok",
                    }).then(pushAllowed => {
                        if(pushAllowed==true){
                            this.showstruk(result.id_struk);
                        }
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

    public showstruk(temp){
        var text="";
        request({
            url: "http://www.apisikedai.melong.web.id/laporan/strukdetail.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                id_struk: temp,
            })
        }).then((response) => {
            const result = response.content.toJSON();
            this.print=result.data;
            this.struk=result.datastruk;
            this.isBusy = false;

            for (var i in this.print) {
                text=text.concat(
                "",this.print[i].nama_barang," X ",this.print[i].jumlah,"\n",
                "Total \t\t: Rp. ",this.print[i].total,"\n");
            }
            this.printReceipt();

        }, (e) => {
        });

    }

    printReceipt() {

        // Variable
        var total="Jumlah";
        var diskon="Diskon";
        var pajak="Pajak";
        var bayar="Bayar(Rp)";
        var kembalian="Kembalian(Rp)"
        var total_akhir="Total(Rp)"

        // Header
        this.hprt.newLine();
        this.hprt.printText(this.struk[this.indexstruk].nama_toko, 1, 1, 0);
        this.hprt.printText(this.struk[this.indexstruk].alamat_toko+" ("+this.struk[this.indexstruk].telepon+")", 1, 1, 0);
        this.hprt.horizontalLine();
        this.hprt.printTextMini("No: "+this.struk[this.indexstruk].kode);
        this.hprt.newLine();

        // Isi
        for (var i in this.print) {
            var rp="";
            var qty =this.print[i].jumlah+" x "+this.print[i].harga;
            rp=rp.concat(this.print[i].total.toString());
            var set=qty.length+rp.length;
            var j=0;
            var show="";
            show=show.concat(qty.toString());
            for(;j<42-set;j++){
                show=show.concat(" ");
            }
            show=show.concat(rp);
            this.hprt.printTextMini(this.print[i].nama_barang);
            this.hprt.printTextMini(show);
        }

        // Footer
        var k=0;
        rp=" ";
        rp=rp.concat(this.struk[this.indexstruk].jumlah_total);
        set=total.length+rp.length;
        for(;k<=41-set;k++){
            total=total.concat(" ");
        }
        total=total.concat(rp);
        this.hprt.horizontalLine();
        this.hprt.printTextMini(total);
        k=0;
        rp=" ";
        rp=rp.concat(this.struk[this.indexstruk].total_bayar);
        set=total_akhir.length+rp.length;
        for(;k<=41-set;k++){
            total_akhir=total_akhir.concat(" ");
        }
        total_akhir=total_akhir.concat(rp);
        this.hprt.printTextMini(total_akhir);
        k=0;
        rp=" ";
        rp=rp.concat(this.struk[this.indexstruk].bayar);
        set=bayar.length+rp.length;
        for(;k<=41-set;k++){
            bayar=bayar.concat(" ");
        }
        bayar=bayar.concat(rp);
        this.hprt.printTextMini(bayar);
        k=0;
        rp=" ";
        rp=rp.concat(this.struk[this.indexstruk].kembalian);
        set=kembalian.length+rp.length;
        for(;k<=41-set;k++){
            kembalian=kembalian.concat(" ");
        }
        kembalian=kembalian.concat(rp);
        this.hprt.printTextMini(kembalian);
        this.hprt.newLine();
        this.hprt.printText("--"+this.struk[this.indexstruk].tanggal+" "+this.struk[this.indexstruk].waktu+"--", 1, 1, 0);
        this.hprt.printText("Thank you for your transaction", 1, 1, 0);
        this.hprt.newLine(2);
    }

    onReturnPress(args,index) {
        // returnPress event will be triggered when user submits a value
        let textField = <TextField>args.object;
        this.data[index].jumlah=Number(textField.text);

        if(this.data[index].stok>this.data[index].jumlah){
            this.data[index].jumlah=this.data[index].jumlah;
        }if(this.data[index].jumlah<0){
            this.data[index].jumlah=0;
        }else{
            this.data[index].jumlah=this.data[index].stok;
            alert("Stok yang tersedia hanya "+this.data[index].stok);
        }
        this.totalcek();

    }

    pencarian(args){
        let textField = <TextField>args.object;
        this.data=[];
        for(var i in this.datatemp){
            var temp=this.datatemp[i].nama_barang.toLowerCase();
            var n=temp.search(textField.text.toLowerCase());
            console.log(n);
            if(n>=0){
                this.data.push(this.datatemp[i])
            }
        }
    }

}
