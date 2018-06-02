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

import {Component} from '@angular/core';

import {AlertController, App, LoadingController, ModalController, NavController, ToastController} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';
import {TemplatesFilter} from "../../../filters/templates-filter";
import {LoggedinPage} from "../loggedin/loggedin";
import {ILogin} from "../../../interfaces/flow-ilogins";


@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage extends LoggedinPage {

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theLoadingCtrl: LoadingController,
        theModalCtrl: ModalController,
        theNavCtrl: NavController,
        theToastCtrl: ToastController,
        theUserData: UserData,
        public templatesFilter: TemplatesFilter
    ) {
        super( theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData);

        console.log("TemplatesPage constructor");
    }

    ngAfterViewInit() {
        this.beLoggedinOrGoToLoginPage();
    }

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
    changeUsername() {
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
