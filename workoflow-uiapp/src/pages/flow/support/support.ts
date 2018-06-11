/*
 * support.ts
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
import { NgForm }    from '@angular/forms';

import { AlertController, App, LoadingController, ModalController, NavController, ToastController } from 'ionic-angular';
import { LoggedinProvider }                                                                         from "../../../providers/loggedin-provider";

import {LoggedinPage} from "../loggedin/loggedin";





@Component(
    {
        selector:    'page-support',
        templateUrl: 'support.html'
    }
)
export class SupportPage extends LoggedinPage {

    // TODO ACV "01806032126 Set to true when the mechanism to send support request is actually implemented. See TODO below
    public static SUPPORTREQUEST_MAYSEND                        = false;
    /*i18n*/public static SUPPORTREQUEST_MAYSEND_NO_TOAST_MESSAGE       = "This does not actually send a support request.";
    /*i18n*/public static SUPPORTREQUEST_TOAST_SENT_MESSAGE             = "Your support request has been sent.";
    /*i18n*/public static SUPPORTREQUEST_INVALIDFORM_MESSAGE            = "Invalid form data. Please review your input";
    public static SUPPORTREQUEST_TOAST_MILLIS                   = 3000;
    /*i18n*/public static SUPPORTREQUEST_SHALLNOTBESUBMITTED_MESSAGE    = "Your support message will not be submitted.";




    // Model for the form input text where the user writes the content of the support request
    supportMessage: string;


    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider
    ) {
        super(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider);

        console.log( "SupportPage constructor" );
    }


    /* **********************************************************************
    Because this FlowBoxPage specialises LoggedinPage this page it is guaranteed by LoggedInPage
    to insure that the user is logged in before proceeding visiting this page
    thanks to the superclass implementation of
    ionViewCanEnter() : Promise<any> {
        return this.beLoggedinOrGoToLoginPage();
    }
    */



    /* **********************************************************************
    Inform the user:
    If the application is not in production, and no test is intended on the support request system
        then no support requests should be sent.
    TODO ACV OJO 201806032001 Dynamically determine whether support request shall be sent, to be driven by some switch DEV/TEST/QA/PREPROD/PROD
    */
    ionViewDidEnter() {

        if( SupportPage.SUPPORTREQUEST_MAYSEND) {
            return;
        }

        // Fire and forget: do not wait for the toast to show or close
        this.show_toast( SupportPage.SUPPORTREQUEST_MAYSEND_NO_TOAST_MESSAGE, SupportPage.SUPPORTREQUEST_TOAST_MILLIS)/*CQT*/.then(()=>{});
    }







    /* **********************************************************************
    Handle user's form submission with different policy depending upon whether support request must be actually sent.
    */
    submit( theForm: NgForm ): Promise<any> {

        if( SupportPage.SUPPORTREQUEST_MAYSEND) {
            return this.sendSupportRequest_MAYSEND_YES( theForm);
        }

        return this.sendSupportRequest_MAYSEND_NO( theForm);
    }






    /* **********************************************************************
    Check that the information supplied by the user is correct.
    If the information is not correct
        then inform the user and stay in the page for the user to keep editing the support request.
    If the information is correct:
        -- DO NOT ! Submit a support request  the message entered.
        Clean user input text
        Show a toast informing the user that the support request has been sent.
    */
    sendSupportRequest_MAYSEND_NO( theForm: NgForm ): Promise<any> {

        if( !theForm.valid ) {
            return Promise.reject( SupportPage.SUPPORTREQUEST_INVALIDFORM_MESSAGE);
        }

        // Clean up the message entered by the user such that method ionViewCanLeave below shall not complain
        // when invoked before abandoning the page by ionic/angular machinery b
        this.supportMessage = "";

        return this.show_toast(   SupportPage.SUPPORTREQUEST_TOAST_SENT_MESSAGE, SupportPage.SUPPORTREQUEST_TOAST_MILLIS);
    }





    /* **********************************************************************
    Check that the information supplied by the user is correct.
    If the information is not correct
        then inform the user and stay in the page for the user to keep editing the support request.
    If the information is correct:
        Submit a support request  the message entered.
        Show a toast informing the user that the support request has been sent.

    TODO ACV 201806032133 Implement sending the support request. For now just delegate to the case MAYSEND_NO
    */
    sendSupportRequest_MAYSEND_YES( theForm: NgForm ): Promise<any> {
        return this.sendSupportRequest_MAYSEND_NO( theForm);
    }






    /* **********************************************************************
    Avoid that the user looses the edited contents by inadvertently navigating out of the page without submitting the form,
        by detecting that there is some content in the form
            Note that submit handlers sendSupportRequest_xx above clean the form field model property.
    If there is some content in the form
        then show an alert which shall prompt the user with two action buttons for the user to choose from and continue:
            to NOT allow to abandon the page and keep editing, allowing the user to actually submit (or clear the contents)
            to allow to ABANDON the page

    Method invoked by the ionic/angular navigation machinery before abandoning the page to navigate to other one
        (may not be invoked when the user closes the browser or the native/hybrid app).

    Methods below are concrete implementation of smallish responsabilites for this page to fill for the superclass (CommonPage) implementation
    */

    /* **********************************************************************
    Some pages can ALWAYS leave without further check or user confirmation.
       i.e. purely "read-only" pages
    */
    ionViewCanLeave_ALWAYS(): boolean {
        return false;
    }

    /* **********************************************************************
   Some pages may need to check for "dirty" contents or forms, to decide whether or to leave the page without user confirmation
   i.e. pages with forms with input fields, i.e.:
   SupportPage with some content in the request text field,
   Task detail pages which are open for editing and changes made), ...
   */
    ionViewCanLeave_SOMETIMES(): Promise<boolean> {
        if( this.supportMessage.trim()) {
            return Promise.reject( false);
        }

        return Promise.resolve( true);
    }

    /* **********************************************************************
    Asynchronously retrieve an extra message to append to the question when prompting the user to confirm leaving the page (in a dialog) .
        i.e. it may reflect some differences with some asynchronous resource
    */
    ionViewCanLeave_PromptExtraMessage(): Promise<string> {
        return Promise.resolve( SupportPage.SUPPORTREQUEST_SHALLNOTBESUBMITTED_MESSAGE);
    }


}
