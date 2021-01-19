import { Component, OnInit } from "@angular/core";
import { Hprt, HPRTPrinter } from "nativescript-hprt";
import {LoadingIndicator} from '@nstudio/nativescript-loading-indicator';
import { Page } from "tns-core-modules";
import * as dialogs from "tns-core-modules/ui/dialogs";

@Component({
    selector: "Transaksi",
    moduleId: module.id,
    templateUrl: "./transaksi.component.html"
})

export class TransaksiComponent implements OnInit {

    items: Array<HPRTPrinter>;
    private hprt: Hprt;

    connected: string;
    text: string;
    selected: boolean;
    btEnabled: boolean;

    loader: any;

    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private page:Page) {
        page.actionBarHidden=true;
        this.text = "Test print";
        this.hprt = new Hprt();
        this.connected = "== NO CONNECTION ==";
        this.selected = false;
        this.btEnabled = this.hprt.isBluetoothEnabled();
        this.loader = new LoadingIndicator();
        if(!this.hprt.isBluetoothEnabled()){
            this.cekBluetooth()
        }
    }

    ngOnInit(): void {
        // Enable bluetooth at start
        // this.enableBluetooth();

    }

    cekBluetooth(){
        dialogs.confirm({
            title: "Info",
            message: "Tolong aktifkan Bluetooth dan tekan Ok.",
            okButtonText: "Ok",
        }).then(result => {
            if(!this.hprt.isBluetoothEnabled()){
                this.cekBluetooth();
            }
        });
    }

    enableBluetooth() {

        console.log("Enabling bluetooth...");
        this.loader.show();

        this.hprt.enableBluetooth().then((res) => {
            console.log("Enabled", res);
            this.btEnabled = true;
            this.loader.hide();
        }, (err) => {
            console.log("Error", err);
            this.loader.hide();
        });
    }

    isBluetoothEnabled() {
        return this.hprt.isBluetoothEnabled();
    }

    searchPrinters() {
        this.hprt.searchPrinters().then(printers => {
            this.items = printers;
        });
    }

    connect(port) {
        this.loader.show();

        this.hprt.connect(port).then((res) => {
            console.log("success", res);
            this.connected = "== PRINTER CONNECTED ==";
            this.selected = true;
            this.loader.hide();
        }, (err) => {
            console.log("error", err)
            this.loader.hide();
        })

    }

    disconnect() {

        this.hprt.disconnect().then((res) => {
            console.log("success", res);
            this.connected = "== NO CONNECTION ==";
            this.selected = false;
        }, (err) => {
            console.log("error", err)
        })

    }

    printTextSimple() {
        this.hprt.printTextSimple(this.text);
    }


}
