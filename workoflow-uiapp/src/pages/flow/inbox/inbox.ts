/*
 * inbox.ts
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
    List,
    ModalController,
    NavController,
    ToastController,
    LoadingController
} from 'ionic-angular';

import {UserData} from '../../../providers/user-data';

import {FlowboxPage} from "../flowbox/flowbox";


@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html'
})
export class InboxPage extends FlowboxPage {
    // Get the inboxList List and not a reference to the controller element
    @ViewChild('contentsListView', {read: List}) contentsList: List;


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

        this.flowboxTitle = "Inbox";
        this.flowboxIcon  = "mail";
        this.segment = "all";
        this.queryText = "";

        console.log( this.flowboxTitle + " constructor");
    }



    updateContent(): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve();
        });
    }


}
