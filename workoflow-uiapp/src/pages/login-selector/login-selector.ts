/*
 * login-selector.ts
 *
 * Created @author Antonio Carrasco Valero 201806021846
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

import {ILogin} from "../../interfaces/flow-ilogins";
import {LoginsProvider} from '../../providers/logins-provider';
import {LoginPage} from '../login/login';


@Component({
    selector: 'login-selector',
    templateUrl: 'login-selector.html'
})
export class LoginSelector {

    loginPage: LoginPage;

    logins: ILogin[];
    selectedLogin: ILogin;

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loginsProvider: LoginsProvider) {

        console.log( "LoginSelector constructor");
    }


    setLoginPage( theLoginPage: LoginPage) {
        this.loginPage = theLoginPage;
    }


    ionViewDidLoad() {
        this.loginsProvider.getAllLogins().subscribe(
            ( theLogins) => {
                this.logins = theLogins;
            },
            ( theError) => {
                console.log( "LoginSelector ionViewDidLoad loginsProvider.getAllLogins ERROR: " + theError);
            });
    }



    loginSelected(): Promise<any> {
        if( !this.selectedLogin) {
            return Promise.resolve( null);
        }

        return this.loginPage.loginSelected( this.selectedLogin);
    }



}
