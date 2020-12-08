
import { Component, OnInit} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { filter } from "rxjs/operators";
import * as ApplicationSettings from "tns-core-modules/application-settings";

@Component({
	selector: "app-bottom-navigation",
	moduleId: module.id,
	templateUrl: "./bottom-navigation.component.html",
    styleUrls: ['bottom-navigation.component.css']
})
export class BottomNavigationComponent implements OnInit {
	hidden:boolean;
	private _activatedUrl: string;
	
	constructor(
		private router: Router,
		private routerExtensions: RouterExtensions) {
		this._activatedUrl = "/home";
	}



	ngOnInit(): void {
		this.router.events
			.pipe(filter((event: any) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
	}

	hiddens(): boolean {
		if(ApplicationSettings.getBoolean("authenticated", false)) {
            this.hidden=true;
        }else{
        	this.hidden=false;
        }
		return this.hidden;
	}

	isComponentSelected(url: string): boolean {
		if(this._activatedUrl=="/login" || this._activatedUrl=="/register"){
			return true;
		}else{
			return this._activatedUrl === url;
		}
	}

	onNavItemTap(navItemRoute: string): void {
		this.routerExtensions.navigate([navItemRoute], {
			transition: {
                name: "slideRight",
                duration: 500,
                curve: "easeIn"
            },
			clearHistory: true
		});
	}
}

