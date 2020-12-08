import { Component, OnInit,OnDestroy } from "@angular/core";
import { android as androidApp } from 'tns-core-modules/application';
import { device } from 'tns-core-modules/platform';
import { Color } from "tns-core-modules/color";
const firebase = require("nativescript-plugin-firebase");
import {Message} from "nativescript-plugin-firebase/messaging";
declare var android: any;
 
@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit,OnDestroy{
    
    constructor() {}

    ngOnDestroy(){}

    ngOnInit(): void {
        firebase.init({
            showNotifications: true,
            showNotificationsWhenInForeground: true,
            onMessageReceivedCallback: (message: Message) => {
                console.log(`Title: ${message.title}`)
                console.log(`Body: ${message.body}`)
                console.log(`Value of 'foo': ${message.data.foo}`)
            },
            onPushTokenReceivedCallback: function (token) {
                console.log("Firebase push token: " + token)
            }
        }).then(
            () => {
                console.log("firebase.init done")
            },
            error => {
                console.log(`firebase.init error: ${error}`)
            }
        )
    }

}
