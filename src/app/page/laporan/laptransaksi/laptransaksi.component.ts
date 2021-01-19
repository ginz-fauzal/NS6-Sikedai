import { Component, OnInit} from "@angular/core";
import { EventData, Page } from "tns-core-modules/ui/page";
import * as ApplicationSettings from "tns-core-modules/application-settings";
import { request} from "tns-core-modules/http";
import { DataService } from "../data.service";
import { Charts } from '../charts';
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Hprt, HPRTPrinter } from "nativescript-hprt";
import { LinearAxis,ChartAxisHorizontalLocation } from "nativescript-ui-chart";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { DateTimePicker } from "nativescript-datetimepicker";
import { Button, TextField } from "tns-core-modules";

@Component({
    selector: "Laptransaksi",
    moduleId: module.id,
    providers: [DataService],
    templateUrl: "./laptransaksi.component.html"
})

export class LaptransaksiComponent implements OnInit {

    // Printer
    private hprt: Hprt;
    struk=[];
    indexstruk=0;
    print=[];

    // Chart
    public _linearAxisZoomPan: LinearAxis;
    public _linearAxisZoom: LinearAxis;
    public _lineSource: ObservableArray<Charts>;
    public tanggal1: string= "";
    public tanggal2: string= "";

    transaksi: string;
    terjual: string;
    pendapatan: string;
    keuntungan: string;
    data: any;
    datatemp: any;
    charts: any;
    lapor:boolean=true;
    push:string;
    isBusy:boolean=false;
    cari:string="";

	constructor(private page: Page,private _dataService: DataService) {
        page.actionBarHidden = true;
        this.tanggal1=this.getFormattedDate(new Date());
        this.tanggal2=this.getFormattedDate(new Date());

        this.hprt = new Hprt();

        this._linearAxisZoom = new LinearAxis();
        this._linearAxisZoom.horizontalLocation = ChartAxisHorizontalLocation.Left;
        this._linearAxisZoom.allowZoom = true;
        this._linearAxisZoomPan = new LinearAxis();
        this._linearAxisZoom.horizontalLocation = ChartAxisHorizontalLocation.Right;
        this._linearAxisZoomPan.allowZoom = true;
        this._linearAxisZoomPan.allowPan = true;

        this.push = ApplicationSettings.getString("push");
        this.getdata();
    }

    ngOnInit(): void {
    }

    public get lineSource(): ObservableArray<Charts> {
        return this._lineSource;
    }

    public get linearAxisZoomPan(): LinearAxis {
        return this._linearAxisZoomPan;
    }

    public set linearAxisZoomPan(value: LinearAxis) {
        this._linearAxisZoomPan = value;
    }

    public get linearAxisZoom(): LinearAxis {
        return this._linearAxisZoom;
    }

    public set linearAxisZoom(value: LinearAxis) {
        this._linearAxisZoom = value;
    }

    public getdata(){
        this.isBusy=true;
        console.log(this.tanggal1);
        request({
            url: "http://www.apisikedai.melong.web.id/laporan/laptransaksi.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                push: this.push,
                tanggal1:this.tanggal1,
                tanggal2:this.tanggal2,
            })
        }).then((response) => {
            const result = response.content.toJSON();
            console.log(result);
            this.transaksi=result.transaksi;
            this.terjual=result.terjual;
            this.pendapatan=result.pendapatan;
            this.keuntungan=result.keuntungan;
            this.isBusy=false;
            this.data=result.struk;
            this.datatemp=result.struk;
            this.charts=result.chart;
            this._lineSource = new ObservableArray(this._dataService.getLineSource(this.charts));
        }, (e) => {
        });
    }

    public formatDollar(num) {
        var p = Number(num).toFixed(0).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "." : "") + acc;
        }, "");
    }

    public showstruk(id){
        var text="";
        request({
            url: "http://www.apisikedai.melong.web.id/laporan/strukdetail.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                id_struk: id,
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

            dialogs.confirm({
                title: "Detail Transaksi",
                message: text,
                okButtonText: "Print",
                cancelButtonText: "Ok",
                neutralButtonText: "Hapus"
            }).then(result => {
                var temp=ApplicationSettings.getBoolean("laporan");
                    if(result==true){
                        this.printReceipt();
                    }else if(result==undefined){
                        this.hapus(id);
                    }
            });

        }, (e) => {
        });

    }

    public hapus(id){
        request({
            url: "http://www.apisikedai.melong.web.id/laporan/strukDel.php",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                id: id,
                push:this.push
            })
        }).then((response) => {
            const result = response.content.toJSON();
            alert(result.message);
            this.isBusy=false;
            this.getdata();
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

    onPickDateTap(args: EventData,id: Number): void {
        const dateToday = new Date();
        const dateTomorrow = new Date(0,0,0);
        const dateNextWeek = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate() + 1);
        DateTimePicker.pickDate({
            context: (<Button>args.object)._context,
            date: dateToday,
            minDate: dateTomorrow,
            maxDate: dateNextWeek,
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            title: "choose date",
            locale: "en_GB"
        }).then((selectedDate: Date) => {
            if (selectedDate) {
                if(id==1){
                    this.tanggal1 = this.getFormattedDate(selectedDate);
                }else{
                    this.tanggal2 = this.getFormattedDate(selectedDate);
                }
            }
            this.getdata();
        });
    }

    getFormattedDate(date: Date): string {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        return (d < 10 ? '0' : '') + d + '-' + (m < 10 ? '0' : '') + m + '-' + y;
    }

    pencarian(args){
        let textField = <TextField>args.object;
        this.data=[];
        for(var i in this.datatemp){
            var temp=this.datatemp[i].Kode_struk.toLowerCase();
            var n=temp.search(textField.text.toLowerCase());
            console.log(n);
            if(n>=0){
                this.data.push(this.datatemp[i])
            }
        }
    }
}
