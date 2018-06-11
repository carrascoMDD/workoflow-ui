/*
 * account.ts
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

import { Component } from '@angular/core';
import {
    AlertController,
    App,
    LoadingController,
    ModalController,
    NavController,
    ToastController
}                    from 'ionic-angular';


import { LoggedinPage }     from "../loggedin/loggedin";
import { LoggedinProvider } from "../../../providers/loggedin-provider";
import { ILogin }           from "../../../interfaces/flow-ilogins";


@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage extends LoggedinPage {

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider
    ) {
        super( theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider );

        console.log("TemplatesPage constructor");
    }


    /* **********************************************************************
    AccountPage can ALWAYS leave without further check or user confirmation.
    The change user name operation is exposed through a modal dialog
    and while editing it the user is prevented from leaving the page or any other user interaction
    other than closing the dismissing the dialog or short of closing the whole browser or tab or app, or shutdown the session, computer or devide.
    */
    ionViewCanLeave_ALWAYS(): boolean {
        return true;
    }
    // AccountPage does not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_SOMETIMES(): Promise<boolean> { return Promise.resolve( true);}
    // AccountPage does not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_PromptExtraMessage(): Promise<string> { return Promise.resolve( "");}



    updatePicture() {
        console.log('Clicked to update picture');
    }

    updateContent() : Promise<any> {
        console.log('Clicked to update picture');
        return new Promise<any>( ()=>{});
    }


    // Present an alert with the current username populated
    // clicking OK will update the username and display it
    // clicking Cancel will close the alert and do nothing
    changeUsername(): Promise<any> {
        return new Promise<ILogin>( ( pheResolve, pheReject) => {
            this.beLoggedinOrGoToLoginPage()
                .then(
                    ( pheAuthenticatedLogin) => {
                        if( !pheAuthenticatedLogin) {
                            pheReject( "User is not logged in");
                            return;
                        }

                        let alert = this.alertCtrl.create({
                            title: 'Change Username',
                            subTitle: pheAuthenticatedLogin.login
                        });
                        alert.addInput({
                            name: 'name',
                            value: pheAuthenticatedLogin.name,
                            placeholder: 'name'
                        });
                        alert.addInput({
                            name: 'familyName',
                            value: pheAuthenticatedLogin.familyName,
                            placeholder: 'username'
                        });
                        alert.addButton({
                            text: 'Ok',
                            handler: (data: any) => {
                                if(data){}/*CQT*/
                                console.log( "Changed User name")
                            }
                        });
                        alert.addButton({
                            text: 'Cancel',
                            handler: (data: any) => {
                                if(data){}/*CQT*/
                                console.log( "Canceled Change User name")
                            }
                        });

                        alert.present()
                            .then(
                                ( ) => {
                                    pheResolve( pheAuthenticatedLogin);
                                },
                                ( ) => {
                                    pheReject( pheAuthenticatedLogin);
                                });
                    },
                    ( pheError) => {
                        pheReject( pheError);
                    }
                );
        });
    }



    changePassword() {
        console.log('Clicked to change password');
    }


    support() {
        this.navCtrl.push('SupportPage');
    }
}
