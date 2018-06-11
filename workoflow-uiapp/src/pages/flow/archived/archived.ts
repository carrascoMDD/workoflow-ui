/*
 * archived.ts
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

import {Component, ViewChild}  from '@angular/core';
import {
    AlertController,
    App,
    List,
    ModalController,
    NavController,
    ToastController,
    LoadingController
} from 'ionic-angular';

import { ActivationsProvider } from "../../../providers/activations-provider";
import { LoggedinProvider }    from "../../../providers/loggedin-provider";
import { FlowlistPage }        from "../flowlist/flowlist";

@Component({
    selector: 'page-archived',
    templateUrl: 'archived.html'
})
export class ArchivedPage extends FlowlistPage {
    // Get the inboxList List and not a reference to the controller element
    @ViewChild('contentsListView', {read: List}) contentsList: List;


    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider,
        theActivationsProvider: ActivationsProvider
    ) {
        super(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider);

        this.flowboxTitle = "Archived";
        this.flowboxIcon  = "done-all";
        this.segment = "all";
        this.queryText = "";

        console.log( this.flowboxTitle + " constructor");
    }


    ionViewDidLoad() {
        console.log("ArchivedPage ionViewDidLoad");
        this.app.setTitle( this.flowboxTitle);
        this.flowheader.setFlowPage( this);
    }


    updateContent(): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve();
        });
    }


}
