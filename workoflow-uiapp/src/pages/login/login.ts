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

import { Component, ViewChild } from '@angular/core';
import { NgForm }               from '@angular/forms';
import { NavController }        from 'ionic-angular';
import { AlertController }      from 'ionic-angular';
import { UserOptions } from '../../interfaces/user-options';

import { SignupPage }             from '../signup/signup';
import { FlowTabsPage }           from '../flow/flowtabs-page/flowtabs-page';
import { IAuthentication }        from "../../interfaces/flow-iauthentication";
import { ILogin }                 from "../../interfaces/flow-ilogins";
import { LoginsProvider }         from '../../providers/logins-provider';
import { AuthenticationProvider } from '../../providers/authentication-provider';
import { LoggedinProvider }       from '../../providers/loggedin-provider';
import { LoginSelector }          from '../login-selector/login-selector';


const MAXERRORLEN = 256;






@Component(
{
    selector:    'page-login',
    templateUrl: 'login.html'
} )
export class LoginPage {

    @ViewChild( LoginSelector ) loginSelector: LoginSelector;

    login: UserOptions = { username: '', password: '' };

    selectedLogin: ILogin;




    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loginsProvider: LoginsProvider,
        public authenticationProvider: AuthenticationProvider,
        public loggedinProvider: LoggedinProvider ) {

        console.log( "LoginPage constructor" );
    }




    ionViewDidLoad() {
        this.loginSelector.setLoginPage( this );
    }





    onLogin( form: NgForm ) {

        if( form.valid ) {
            this.doLogin();
        }
    }




    onSignup(): Promise<any> {
        return this.navCtrl.push( SignupPage );
    }






    loginSelected( theSelectedLogin: ILogin ): Promise<any> {
        if( !theSelectedLogin ) {
            this.login.username = "";
            this.login.password = "";
            return;
        }

        this.login.username = theSelectedLogin.login;
        this.login.password = "AnyPasswordGoes";

        /* As we have just "typed" values in the form,
        allow onlookers (i.e. Selenium Protractor) to be able to see them in the "next tick"
        before continuing with the doLogin.
         */
        return new Promise( ( pheResolve, pheReject ) => {
            setTimeout(
                () => {
                    this.doLogin().then(
                        ( pheResult ) => {
                            pheResolve( pheResult );
                        },
                        ( theError ) => {
                            pheReject( theError );
                        } )
                },
                0
            )
        } );

    }





    doLogin(): Promise<any> {
        return new Promise( ( pheResolve, pheReject ) => {

            this.authenticationProvider.authenticate( this.login.username, this.login.password )
                .subscribe(
                    ( theAuthentication: IAuthentication ) => {
                        this.loggedinProvider.authenticationPerformed( theAuthentication )
                            .then(
                                () => {
                                    return this.navCtrl.push( FlowTabsPage );
                                },
                                ( theError ) => {
                                    throw theError;
                                }
                            )
                            .then(
                                () => {
                                    pheResolve();
                                },
                                ( theError ) => {
                                    pheReject( theError );

                                    this.alertCtrl.create( {
                                                               title:    'Error after authentication',
                                                               subTitle: theError.toString().substr( 0, MAXERRORLEN ),
                                                               buttons:  [ 'Dismiss' ]
                                                           } );
                                }
                            );
                    },
                    ( theError: any ) => {
                        pheReject( theError );

                        this.alertCtrl.create( {
                                                   title:    'Error during authentication',
                                                   subTitle: theError.toString().substr( 0, MAXERRORLEN ),
                                                   buttons:  [ 'Dismiss' ]
                                               } );
                    }
                );
        } );
    }



}
