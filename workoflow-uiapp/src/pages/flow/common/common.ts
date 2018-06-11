/*
 * common.ts
 *
 * Created @author Antonio Carrasco Valero 201806032137
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
    ModalController,
    ToastController,
    LoadingController,
    FabContainer
}                       from 'ionic-angular';
import { FlowlistPage } from "../flowlist/flowlist";






/* **********************************************************************
Abstract class offering general user interface widgets and interactions intended to be reused by subclass pages.
*/
@Component(
    {
        selector:    'page-common',
        templateUrl: 'common.html'
    }
)
export abstract class CommonPage {

    static OPENSOCIAL_MILLIS_RANDOM = 0;    // 1000;
    static OPENSOCIAL_MILLIS_MIN    = 1000; // 500;

    static TOAST_MILLIS_DEFAULT     = 3000;
    static TOAST_MILLIS_MAX         = 30000;



    /*i18n*/static POSTINGTOSOCIALNETWORK_MESSAGE = "Posting to social network";

    /*i18n*/static LEAVETHISPAGE_TITLE       = "Leave this page ?";
    /*i18n*/static LEAVETHISPAGE_QUESTION    = "Are you sure you want to leave this page?";
    /*i18n*/static LEAVETHISPAGE_STAY_LABEL  = "Stay";
    /*i18n*/static LEAVETHISPAGE_LEAVE_LABEL = "Leave";




    constructor(
        public app: App,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController
    ) {
        console.log( "(abstract)CommonPage constructor" );
    }




    present_alert(
        theTitle: string,
        theSubTitle: string,
        theOKLabel: string ) {

        return new Promise( ( pheResolve: any, pheReject: any ) => {
            if( pheReject )/*CQT*/{}

            this.alertCtrl
                .create(
                    {
                        title:    theTitle,
                        subTitle: theSubTitle
                    }
                )
                .addButton( { text: theOKLabel, handler: pheResolve } )
                .present()/*CQT*/.then( () => {} );
        } );
    }




    /* **********************************************************************
    Present a modal dialog,  or equivalent device user interface language idiom,
    with the supplied title and message, and buttons for OK and CANCEL with the supplied labels.
    */
    present_confirm_cancel(
        theTitle: string,
        theMessage: string,
        theOKLabel: string,
        theCancelLabel: string ): boolean | Promise<boolean> {

        return new Promise( ( pheResolve: any, pheReject: any ) => {
            this.alertCtrl
                .create(
                    {
                        title:   theTitle,
                        message: theMessage
                    }
                )
                .addButton( { text: theOKLabel, handler: pheReject } )
                .addButton( { text: theCancelLabel, role: 'cancel', handler: pheResolve } )
                .present()/*CQT*/.then( () => {} );
        } );
    }





    /* **********************************************************************
    Posting to social networks is only allowed to logged in users.

    Note that this behavior implemented in this abstract superclass is available to subclasses
    and subclasses are guaranteed to operate only for logged in users
        as per ionic/angular invocation of ionViewCanEnter() delegating on beLoggedinOrGoToLoginPage above.
    */
    show_toast( theMessage: string, theMillisToToast: number = FlowlistPage.TOAST_MILLIS_DEFAULT ): Promise<any> {

        if( !( theMessage && theMillisToToast ) ) {
            return Promise.resolve();
        }

        return new Promise<any>( ( pheResolveTop, pheRejectTop ) => {
            if( pheRejectTop ) {}
            /*CQT*/

            this.toastCtrl
                .create(
                    {
                        message:  theMessage,
                        duration: ( theMillisToToast <= FlowlistPage.TOAST_MILLIS_MAX ? theMillisToToast : FlowlistPage.TOAST_MILLIS_MAX )
                    }
                )
                .present()
                .then(
                    () => {
                        pheResolveTop();
                    },
                    () => {
                        pheResolveTop();
                    }
                );
        } );
    }











    /* **********************************************************************
    Avoid that the user looses the edited contents by inadvertently navigating out of the page.
    If there is some content in the form
        then show an alert which shall prompt the user with two action buttons for the user to choose from before program interactions continue:
            OK: to allow to abandon the page
            CANCEL: to not allow to ABANDON the page, STAYing in the page

    Relies on implementation by specialisations of smallish responsibilities (declared as abstract in this CommonPage):
        ionViewCanLeave_ALWAYS ionViewCanLeave_SOMETIMES ionViewCanLeave_PromptExtraMessage

    Method invoked by the ionic/angular navigation machinery before abandoning the page to navigate to other one
        (may not be invoked when the user closes the browser or the native/hybrid app).
    */
    ionViewCanLeave(): Promise<boolean> {

        if( this.ionViewCanLeave_ALWAYS()) {
            return Promise.resolve( true);

        }
        return new Promise<boolean>( ( pheResolve, pheReject ) => {

            /* **********************************************************************
            Some pages can ALWAYS leave without further check or user confirmation.
                i.e. purely "read-only" pages
            */
            // Guard to avoid promise steps after first one to engage in further processing
            let anAlreadyDecided = false;
            let aCanLeaveNow     = false;

            this.ionViewCanLeave_SOMETIMES()
                .then(
                    ( theCanLeave ) => {
                        if( theCanLeave ) {
                            aCanLeaveNow = true;
                            anAlreadyDecided = true;
                            return Promise.resolve( true );
                        }

                        // The page, which is not ALWAYS able to leave without user confirmation, has asynchronously checked whether the page can leave
                        if( theCanLeave ) {
                            aCanLeaveNow = true;
                            anAlreadyDecided = true;
                            return Promise.resolve( null );
                        }

                        /* **********************************************************************
                        The page is not able NOW to leave without user confirmation
                        Asynchronously retrieve an extra message to append to the question when prompting the user to confirm leaving the page (in a dialog) .
                        i.e. it may reflect some differences with some asynchronous resource
                        */
                        return this.ionViewCanLeave_PromptExtraMessage();
                    },
                    ( theError ) => {
                        /* **********************************************************************
                        The implementation of ionViewCanLeave_SOMETIMES in concrete specialisations
                            may .reject the returned promise, rather than .resolve(false).
                        Because it is expected (in this design) to be an straightforward check constant for each page type,
                            we do not need to handle the error channel as an exceptional one, but rather as responding false.
                        */
                        if( theError ) {}/*CQT*/

                        aCanLeaveNow = false;
                        anAlreadyDecided = true;
                        return Promise.resolve( null );
                    }
                )
                .then(
                    ( thePromptExtraMessage ) => {

                        // Was already decided in promise above that the page can leave (either ALWAYS or NOW - after checking asynchronously)
                        if( anAlreadyDecided ) {
                            return Promise.resolve( null );
                        }

                        // Prompt the user (with a dialog) for confirmation about leaving the page, appending the extra message retrieved asynchronously above
                        const anExtraMessage = thePromptExtraMessage || "";
                        return this.present_confirm_cancel(
                            CommonPage.LEAVETHISPAGE_TITLE,
                            CommonPage.LEAVETHISPAGE_QUESTION + anExtraMessage,
                            CommonPage.LEAVETHISPAGE_LEAVE_LABEL, // theOKLabel
                            CommonPage.LEAVETHISPAGE_STAY_LABEL )  // theCancelLabel
                    },
                    ( theError ) => {
                        /* **********************************************************************
                        If there was some error retrieving the extra message, it may actually be an exceptional condition.
                        Signal the exceptional condition by re-throwing. Catch ( theError) below shall not allow to leave the page.
                        */
                        aCanLeaveNow = false;
                        anAlreadyDecided = true;
                        throw theError;
                    }
                )
                .then(
                    ( theUserConfirmed ) => {
                        // Was already decided in promise above that the page can leave (either ALWAYS or NOW - after checking asynchronously)
                        if( anAlreadyDecided ) {
                            return Promise.resolve( aCanLeaveNow );
                        }

                        // Resolve with the users choice
                        pheResolve( true === theUserConfirmed );
                    },
                    ( theError ) => {
                        /* **********************************************************************
                        If there was some error during the dialog, it may actually be an exceptional condition.
                        Do not allow to leave the page.
                        Signal the exceptional condition by re-throwing.
                        */

                        pheReject( theError );
                    }
                );
        } );
    }

    /* **********************************************************************
       Some pages can ALWAYS leave without further check or user confirmation.
          i.e. purely "read-only" pages
       */
    abstract ionViewCanLeave_ALWAYS(): boolean;

    /* **********************************************************************
    Some pages may need to check for "dirty" contents or forms, to decide whether or to leave the page without user confirmation
    i.e. pages with forms with input fields, i.e.:
    SupportPage with some content in the request text field,
    Task detail pages which are open for editing and changes made), ...
    */
    abstract ionViewCanLeave_SOMETIMES(): Promise<boolean>;

    /* **********************************************************************
    Asynchronously retrieve an extra message to append to the question when prompting the user to confirm leaving the page (in a dialog) .
        i.e. it may reflect some differences with some asynchronous resource
    */
    abstract ionViewCanLeave_PromptExtraMessage(): Promise<string>;






    /* **********************************************************************
    Posting to social networks is only allowed to logged in users.

    Note that this behavior implemented in this abstract superclass is available to subclasses
    and subclasses are guaranteed to operate only for logged in users
        as per ionic/angular invocation of ionViewCanEnter() delegating on beLoggedinOrGoToLoginPage above.
    */
    openSocial( theNetwork: string, theFab: FabContainer ): Promise<any> {

        const aLoading = this.loadingCtrl.create(
            {
                content:  `${CommonPage.POSTINGTOSOCIALNETWORK_MESSAGE} to ${theNetwork}`,
                duration: CommonPage.OPENSOCIAL_MILLIS_MIN + Math.random() * CommonPage.OPENSOCIAL_MILLIS_RANDOM
            } );

        aLoading.onWillDismiss( () => {
            theFab.close();
        });

        return aLoading.present();
    }


}
