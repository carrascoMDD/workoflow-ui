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

import {Component} from '@angular/core';
import {
    AlertController,
    App,
    ModalController,
    NavController,
    ToastController,
    LoadingController, Refresher
} from 'ionic-angular';


import { FlowboxPage }          from "../flowbox/flowbox";
import { IdentitiesFilterPage } from "../identities-filter/identitites-filter";
import { LoggedinProvider }     from '../../../providers/loggedin-provider';
import { ActivationsProvider }  from '../../../providers/activations-provider';


@Component({
    selector: 'page-flowlist',
    templateUrl: 'flowlist.html'
})
export abstract class FlowlistPage extends FlowboxPage {


    /*i18n*/static TOAST_REFRESHED_MESSAGE = "Updated";
    static TOAST_UPDATED_MILLIS = 3000;


    segment:        string;
    queryText:      string;

    hasAnyFavoriteItem = false;
    hasAnyUrgentItem   = false;


    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider,
        public activationsProvider: ActivationsProvider
    ) {
        super(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider);

        this.flowboxTitle = "(abstract)Flowlist";
        this.flowboxIcon  = "grid";
        this.segment      = "all";
        this.queryText    = "";
        this.hasAnyFavoriteItem = false;
        this.hasAnyUrgentItem   = false;

        console.log( this.flowboxTitle + " constructor");
    }






    /* **********************************************************************
    TODO ACV OJO 201806040129 This may be way redundant! Check whether user is logged in before performing updateContent()
    upon entering in the view, even if already checked through supertype LoginPage ionViewCanEnter()
    May be could be simplified to just a fire-and-forget of this.updateContent()
     */
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



    /* **********************************************************************
    Flowlist specialisations can ALWAYS leave without further check or user confirmation.
    Because all specialisations must be a list presentation without edits
        other than the query value  which as of today 201806040113 is transient to the page
            we'll see in the future whether/how to persist recent/useful query strings
            and whether such affects leaving the page.
            Chances are that any such persistence of queries shall be handled by some mechanism
            which won't render the page "dirty" for the purpose of leaving the page
    */
    ionViewCanLeave_ALWAYS(): boolean {
        return true;
    }
    // FLowlist specialisations do not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_SOMETIMES(): Promise<boolean> { return Promise.resolve( true);}
    // FLowlist specialisations do not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_PromptExtraMessage(): Promise<string> { return Promise.resolve( "");}




    /* **********************************************************************
    Shows a modal with the tree of applications and identities available to the logged in user
    with one UI widget to enable/disable each application and identity.
   */
    presentFilter():void {
        const aFilterModal = this.modalCtrl.create( IdentitiesFilterPage);
        aFilterModal.onWillDismiss( ( theData: any[]) => {
            if ( theData) {
                this.updateContent();
            }
        });
        // fire-and-forget . shall handle close with onWillDismiss handler above
        aFilterModal.present().then(()=>{});
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
                        this.toast_Refreshed()/*CQT*/.then(()=>{});

                        resolveTop( pheResult);
                    },
                    ( pheError) => {
                        rejectTop( pheError);
                    }
                );
        });
    }




    /* **********************************************************************
    Show a toast when the content has been updated by refresh.
    */
    toast_Refreshed(): Promise<any> {
        return this.show_toast( FlowlistPage.TOAST_REFRESHED_MESSAGE, FlowlistPage.TOAST_UPDATED_MILLIS);
    }





    abstract updateContent(): Promise<any>;
    /*  Default implementation should be at a minimum:
    updateContent(): Promise<any> {
        return Promise<any.resolve();
    }
    */

}
