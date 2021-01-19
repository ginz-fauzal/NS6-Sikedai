import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";


const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", loadChildren: () => import("~/app/page/login/login.module").then((m) => m.LoginModule) },
    { path: "register", loadChildren: () => import("~/app/page/register/register.module").then((m) => m.RegisterModule) },
    { path: "home", loadChildren: () => import("~/app/page/home/home.module").then((m) => m.HomeModule) },
    { path: "akun", loadChildren: () => import("~/app/page/akun/akun.module").then((m) => m.AkunModule) },
    { path: "manajemen", loadChildren: () => import("~/app/page/manajemen/manajemen.module").then((m) => m.ManajemenModule) },
    { path: "barang", loadChildren: () => import("~/app/page/manajemen/barang/barang.module").then((m) => m.BarangModule) },
    { path: "stok", loadChildren: () => import("~/app/page/manajemen/stok/stok.module").then((m) => m.StokModule) },
    { path: "laporan", loadChildren: () => import("~/app/page/laporan/laporan.module").then((m) => m.LaporanModule) },
    { path: "laptransaksi", loadChildren: () => import("~/app/page/laporan/laptransaksi/laptransaksi.module").then((m) => m.LaptransaksiModule) },
    { path: "transaksi", loadChildren: () => import("~/app/page/setting/transaksi.module").then((m) => m.TransaksiModule) },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
