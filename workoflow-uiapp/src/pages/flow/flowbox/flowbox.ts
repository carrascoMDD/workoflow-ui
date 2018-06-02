/*
 * flowbox.ts
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

import {Component, ViewChild} from '@angular/core';
import {
    AlertController,
    App,
    ModalController,
    NavController,
    ToastController,
    LoadingController, Refresher
} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';

import {LoggedinPage} from "../loggedin/loggedin";
import {IdentitiesFilterPage} from "../identities-filter/identitites-filter";
import {FlowHeader} from "../flow-header/flow-header";


@Component({
    selector: 'page-flowbox',
    templateUrl: 'flowbox.html'
})
export class FlowboxPage extends LoggedinPage {

    @ViewChild( FlowHeader) flowheader: FlowHeader;


    flowboxTitle:   string;
    flowboxIcon:    string;
    segment:        string;
    queryText:      string;

    hasAnyFavoriteItem = false;
    hasAnyUrgentItem   = false;


    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theLoadingCtrl: LoadingController,
        theModalCtrl: ModalController,
        theNavCtrl: NavController,
        theToastCtrl: ToastController,
        theUserData: UserData
    ) {
        super(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData);

        this.flowboxTitle = "(abstract)Flowbox";
        this.flowboxIcon  = "grid";
        this.segment = "all";
        this.queryText = "";

        console.log( this.flowboxTitle + " constructor");
    }



    ionViewDidLoad() {
        console.log( this.flowboxTitle + " ionViewDidLoad");
        this.app.setTitle( this.flowboxTitle);
        this.flowheader.setFlowPage( this);
    }




    ionViewDidEnter() {
        console.log("(abstract)LoggedinPage ionViewDidEnter");
        this.beLoggedinOrGoToLoginPage()
            .then(
                ( pheIsLoggedIn) => {
                    if( pheIsLoggedIn) {
                        return this.updateContent();
                    }
                },
                ( pheError) => {
                    throw pheError;
                }
            )
    }




    presentFilter():void {
        let modal = this.modalCtrl.create( IdentitiesFilterPage);
        modal.present();

        modal.onWillDismiss((data: any[]) => {
            if (data) {
                this.updateContent();
            }
        });
    }



    doRefresh(refresher: Refresher) {
        return new Promise<any>( ( resolveTop, rejectTop) => {
            this.beLoggedinOrGoToLoginPage()
                .then(
                    ( pheIsLoggedIn) => {
                        if(pheIsLoggedIn){}/*CQT*/
                        return this.updateContent();
                    },
                    ( pheError) => {
                        throw pheError;
                    }
                )
                .then(
                    ( pheResult) => {
                        refresher.complete();

                        /* ************************************************
                        FireAndForget: Let this one run on its own,
                        hopefully suffling pages while still open shall not break or break it !
                         */
                        this.toast_Updated( "Updated", 3000)/*CQT*/.then(()=>{});

                        resolveTop( pheResult);
                    },
                    ( pheError) => {
                        rejectTop( pheError);
                    }
                );
        });
    }





    //abstract
    updateContent(): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve();
        });
    }


}
