/*
 * logout.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */

import {Component} from '@angular/core';

import {
    AlertController,
    App,
    ModalController,
    NavController,
    ToastController,
    LoadingController
} from 'ionic-angular';

import {LoggedinProvider} from '../../../providers/loggedin-provider';
import {LoggedinPage} from '../loggedin/loggedin';


@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html'
})
export class LogoutPage extends LoggedinPage {


    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider
    ) {
        super(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider);

        console.log("LogoutPage constructor");
    }


    ionViewDidLoad() {
        console.log("LogoutPage ionViewDidLoad");
        this.app.setTitle('Logout');
    }


    /* **********************************************************************
    LogoutPage can ALWAYS leave without further check or user confirmation.
    */
    ionViewCanLeave_ALWAYS(): boolean {
        return true;
    }
    // LogoutPage does not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_SOMETIMES(): Promise<boolean> { return Promise.resolve( true);}
    // LogoutPage does not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_PromptExtraMessage(): Promise<string> { return Promise.resolve( "");}


}
