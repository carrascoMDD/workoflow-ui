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

import {UserData} from '../../../providers/user-data';


import {ILogin} from '../../../interfaces/flow-ilogins';

import {LoginPage} from '../../login/login';


@Component({
    selector: 'page-loggedin',
    templateUrl: 'loggedin.html'
})
export abstract class LoggedinPage {

    authenticatedLogin: ILogin;

    constructor(
        public app: App,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public userData: UserData
    ) {
        console.log("(abstract)LoggedinPage constructor");
    }



    ionViewDidLoad() {
        console.log("(abstract)LoggedinPage ionViewDidLoad");
        this.app.setTitle( "(abstract)LoggedinPage");
    }



    ionViewCanEnter() : Promise<any> {
        return this.beLoggedinOrGoToLoginPage();
    }






    beLoggedinOrGoToLoginPage() : Promise<ILogin> {
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise<ILogin>( ( pheResolve, pheReject) => {
            this.userData.getAuthenticatedLogin()
                .then(
                    ( theAuthenticatedLogin) => {
                        if ( theAuthenticatedLogin) {
                            this.authenticatedLogin = theAuthenticatedLogin;
                            console.log("(abstract)LoggedinPage LOGGED IN beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin()");
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
                                        else {
                                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage EMPTY this.navCtrl.length()" + " about to setRoot( LoginPage)");
                                            this.app.getRootNav().setRoot( LoginPage)
                                                .then(
                                                    () => {
                                                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage done this.app.getRootNav().setRoot( LoginPage)");
                                                        pheReject( false);
                                                    },
                                                    ( theError) => {
                                                        const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in setRoot() theError=" + theError;
                                                        console.log( aMsg);
                                                        pheReject( "User not logged in\n" + aMsg);
                                                    }
                                                );
                                        }
                                    },
                                    ( theError) => {
                                        const aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage NO this.userData.getAuthenticatedLogin() theError=" + theError;
                                        console.log( aMsg);
                                        pheReject( "User not logged in\n" + aMsg);
                                    }
                                );
                        }
                    },
                    (theError) => {
                        const aMsg = "((abstract)LoggedinPage beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin() error=" + theError;
                        console.log( aMsg);
                        pheReject( "User not logged in\n" + aMsg);
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





    toast_Updated( theMessage: string, theMillisToToast: number = 3000): Promise<any> {
        return new Promise<any>( ( pheResolveTop, pheRejectTop) => {
            if(pheRejectTop){}/*CQT*/

            this.toastCtrl
                .create({
                    message: ( theMessage ? theMessage : "Updated"),
                    duration: ( theMillisToToast <= 30000 ? theMillisToToast: 30000)
                })
                .present()
                .then(
                    () => {
                        pheResolveTop();
                    },
                    () => {
                        pheResolveTop();
                    }
                );
        });
    }





    logout() : Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject) => {
            if(pheReject){}/*CQT*/
            this.userData.logout()
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


    openSocial(network: string, fab: FabContainer) {
        let loading = this.loadingCtrl.create({
            content: `Posting to ${network}`,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(() => {
            fab.close();
        });
        loading.present();
    }


}
