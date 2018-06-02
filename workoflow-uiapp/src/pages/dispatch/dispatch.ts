/*
 * dispatch.ts
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
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';

import {UserData} from '../../providers/user-data';
import {FlowTabsPage} from '../flow/flowtabs-page/flowtabs-page';
import {LoginPage} from "../login/login";


@Component({
    selector: 'page-user',
    templateUrl: 'dispatch.html'
})
export class DispatchPage {

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public userData: UserData) {
        console.log( "DispatchPage constructor");
    }

    ionViewDidLoad() {
        this.userData.hasLoggedIn()
            .then(
                (theHasLoggedIn) => {
                    if( theHasLoggedIn) {
                        this.navCtrl.setRoot( FlowTabsPage);
                    }
                    else {
                        this.navCtrl.setRoot( LoginPage);
                    }
                },
                ( theError) => {
                    console.log( "TutorialPage startApp this.userData.hasLoggedIn() error=" + theError);
                    throw theError;
                });
    }


}
