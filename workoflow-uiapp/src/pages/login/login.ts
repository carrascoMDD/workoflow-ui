/*
 * login.ts
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
import {NgForm} from '@angular/forms';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';

import {UserData} from '../../providers/user-data';
import {UserOptions} from '../../interfaces/user-options';
import {FlowTabsPage} from '../flow/flowtabs-page/flowtabs-page';
import {IAuthentication} from "../../interfaces/flow-iauthentication";
import {ILogin} from "../../interfaces/flow-ilogins";
import {LoginsProvider} from '../../providers/logins-provider';
import {AuthenticationProvider} from '../../providers/authentication-provider';


const MAXERRORLEN = 256;

@Component({
    selector: 'page-user',
    templateUrl: 'login.html'
})
export class LoginPage {

    login: UserOptions = { username: '', password: ''};
    submitted = false;

    logins: ILogin[];

    selectedLogin: ILogin;


    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public userData: UserData,
        public loginsProvider: LoginsProvider,
        public authenticationProvider: AuthenticationProvider) {
        console.log( "LoginPage constructor");
    }

    ionViewDidLoad() {
        this.loginsProvider.getAllLogins().subscribe(
            ( theLogins) => {
                this.logins = theLogins;
            },
            ( theError) => {
                console.log( "LoginPage ionViewDidLoad loginsProvider.getAllLogins ERROR: " + theError);
            });
    }


    courtesyLoginSelected(): void {
        if( !this.selectedLogin) {
            this.login.username = "";
            this.login.password = "";
            return;
        }

        this.login.username = this.selectedLogin.login;
        this.login.password = "AnyPasswordGoes";

        this.doLogin();
    }



    doLogin() {
        this.authenticationProvider.authenticate( this.login.username, this.login.password)
            .subscribe(
                ( theAuthentication : IAuthentication) => {
                    this.userData.authenticationPerformed( theAuthentication).then(
                        () => {
                            this.navCtrl.push( FlowTabsPage);
                        },
                        ( theError) => {
                            this.alertCtrl.create({
                                title: 'Error after authentication',
                                subTitle: theError.toString().substr( 0, MAXERRORLEN),
                                buttons: [ 'Dismiss']
                            });
                        });
                },
                ( theError : any) => {
                    this.alertCtrl.create({
                        title: 'Error during authentication',
                        subTitle: theError.toString().substr( 0, MAXERRORLEN),
                        buttons: [ 'Dismiss']
                    });
                }
        );
    }



    onLogin(form: NgForm) {
        this.submitted = true;

        if (form.valid) {
            this.doLogin();
        }
    }



    onSignup() {
       this.userData.authenticationPerformed( null).then(
            () => {
                this.navCtrl.push( FlowTabsPage);
            },
            ( theError) => {
                this.alertCtrl.create({
                    title: 'Error after authentication',
                    subTitle: theError.toString().substr( 0, MAXERRORLEN),
                    buttons: [ 'Dismiss']
                });
            }
        );
    }
}
