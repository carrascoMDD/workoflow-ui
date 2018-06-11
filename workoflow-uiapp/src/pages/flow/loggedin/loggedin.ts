/*
 * loggedin.ts
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
    LoadingController,
    FabContainer
} from 'ionic-angular';

import {LoggedinProvider} from '../../../providers/loggedin-provider';

import {ILogin} from '../../../interfaces/flow-ilogins';

import {LoginPage}    from '../../login/login';
import { CommonPage } from "../common/common";

/* **********************************************************************
Abstract class intended to be reused by specialisation by pages which require the user to be logged in.
*/
@Component({
    selector: 'page-loggedin',
    templateUrl: 'loggedin.html'
})
export abstract class LoggedinPage extends CommonPage {

    static OPENSOCIAL_MILLIS_RANDOM = 0; // 1000;
    static OPENSOCIAL_MILLIS_MIN    = 1000; // 500;

    authenticatedLogin: ILogin;

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        public navCtrl: NavController,
        public loggedinProvider: LoggedinProvider
    ) {
        super( theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl);

        console.log("(abstract)LoggedinPage constructor");
    }


    /* **********************************************************************
    Ensure that the user is logged in before proceeding visiting this page.
    If the user is not logged in
    then present the LoginPage, and not this page
    */
    ionViewCanEnter() : Promise<any> {
        return this.beLoggedinOrGoToLoginPage();
    }




    /* **********************************************************************
    Returns a promise which shall resolve to the ILogin of the logged in user if any,
    or be rejected if the user is not loged in.

    If the user is not logged in
    then
        an alert is presented to the user indicating that the user is not logged in
        navigation is directed to the Login Page

    Obtains AuthenticatedLogin (an ILogin) from LoggedinProvider
    If authenticated
        then proceed resolving with the ILogin instance of the authenticated user

    else ( the user is not authenticated)
        presentAlert
        set the root nav root to LoginPage
        reject the returned promise
    */
    beLoggedinOrGoToLoginPage() : Promise<ILogin> {
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise<ILogin>( ( pheResolve, pheReject) => {
            this.loggedinProvider.getAuthenticatedLogin()
                .then(
                    ( theAuthenticatedLogin) => {
                        if ( theAuthenticatedLogin) {
                            this.authenticatedLogin = theAuthenticatedLogin;
                            console.log("(abstract)LoggedinPage LOGGED IN beLoggedinOrGoToLoginPage this.loggedinProvider.getAuthenticatedLogin()");
                            pheResolve( theAuthenticatedLogin);
                            return;
                        }
                        else {
                            console.log( "(abstract)LoggedinPage NOT logged in beLoggedinOrGoToLoginPage FALSE theHasLoggedIn");
                            this.presentAlert()
                                .then(
                                    () => {
                                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage after alert");
                                        let aNavCtrlLength = 0;
                                        try {
                                            aNavCtrlLength = this.navCtrl && this.navCtrl.length();
                                        }
                                        catch( anException){
                                            console.log( "(abstract)LoggedinPage beLoggedinOrGoToLoginPage EXCEPTION during this.navCtrl && this.navCtrl.length()" + anException);
                                        }
                                        if( aNavCtrlLength) {
                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage this.navCtrl.length()=" + this.navCtrl.length() + " about to popToRoot()");
                                            setTimeout( ()=> {
                                                this.app.getRootNav().setRoot( LoginPage)
                                                    .then(
                                                        () => {
                                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage done this.app.getRootNav().setRoot( LoginPage)");
                                                            pheReject( "User not logged in");

                                                        },
                                                        ( theError) => {
                                                            const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in popToRoot() theError=" + theError;
                                                            console.log( aMsg);
                                                            pheReject( "User not logged in\n" + aMsg);
                                                        }
                                                    );
                                            }, 0);

                                        }
                                    },
                                    ( theError) => {
                                        const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage NO this.loggedinProvider.getAuthenticatedLogin() theError=" + theError;
                                        console.log( aMsg);
                                        pheReject( "User not logged in\n" + aMsg);
                                    }
                                );
                        }
                    },
                    (theError) => {
                        const aMsg = "((abstract)LoggedinPage beLoggedinOrGoToLoginPage this.loggedinProvider.getAuthenticatedLogin() error=" + theError;
                        console.log( aMsg);
                        pheReject( "User not logged in\n" + aMsg);
                    }
                );
        });
    }






    logout() : Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject) => {
            this.loggedinProvider.logout()
                .then(
                    ( ) => {
                        return this.app.getRootNav().setRoot( LoginPage);
                    },
                    ( theError) => {
                        if(theError){}/*CQT*/
                        throw theError;
                    }
                )
                .then(
                    ( ) => {
                        pheResolve();
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }





    presentAlert() {
        let alert = this.alertCtrl.create({
            title: "You are not logged in, or your session expired",
            subTitle: "Please login",
            buttons: ["Go to Login"]
        });
        return alert.present();
    }






    /* **********************************************************************
    Posting to social networks is only allowed to logged in users.

    Note that this behavior implemented in this abstract superclass is available to subclasses
    and subclasses are guaranteed to operate only for logged in users
        as per ionic/angular invocation of ionViewCanEnter() delegating on beLoggedinOrGoToLoginPage above.
    */
    openSocial( theNetwork: string, theFab: FabContainer): Promise<any> {

        const aLoading = this.loadingCtrl.create({
            content: `Posting to ${theNetwork}`,
            duration: LoggedinPage.OPENSOCIAL_MILLIS_MIN + Math.random() * LoggedinPage.OPENSOCIAL_MILLIS_RANDOM
        });

        aLoading.onWillDismiss(() => {
            theFab.close();
        });

        return aLoading.present();
    }


}
