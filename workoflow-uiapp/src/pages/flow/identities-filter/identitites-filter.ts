/*
 * identitites-filter.ts
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
    AlertController, App,
    LoadingController, ModalController,
    NavController,
    NavParams,
    ToastController,
    ViewController
} from 'ionic-angular';

import { IApplicationActivation } from "../../../interfaces/flow-iactivations";
import { ActivationsProvider }    from "../../../providers/activations-provider";
import { LoggedinProvider }       from "../../../providers/loggedin-provider";
import { LoggedinPage }           from "../loggedin/loggedin";



@Component(
    {
        selector:    'page-identities-filter',
        templateUrl: 'identities-filter.html'
    } )
export class IdentitiesFilterPage extends LoggedinPage {


    applicationActivations: IApplicationActivation[];

    applicationActivations_original: IApplicationActivation[];


    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public activationsProvider: ActivationsProvider ) {

        super( theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider );

        console.log( "IdentitiesFilterPage constructor" );
    }



    /* **********************************************************************
    IdentitiesFilterPage can ALWAYS leave without further check or user confirmation.
    */
    ionViewCanLeave_ALWAYS(): boolean {
        return true;
    }
    // IdentitiesFilterPage does not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_SOMETIMES(): Promise<boolean> { return Promise.resolve( true);}
    // IdentitiesFilterPage does not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    ionViewCanLeave_PromptExtraMessage(): Promise<string> { return Promise.resolve( "");}





    ionViewDidEnter() {
        console.log( "TemplatesPage ionViewDidEnter" );
        this.updateContent().then(() =>{});
    }



    updateContent(): Promise<IApplicationActivation[]> {

        return new Promise( ( pheResolve, pheReject ) => {

            this.activationsProvider.getApplicationActivations()
                .then(
                    ( theApplicationActivations: IApplicationActivation[] ) => {

                        this.applicationActivations_original = theApplicationActivations;
                        this.applicationActivations = this.applicationActivations_original.map(
                            ( theApplicationActivation) => {
                                return theApplicationActivation.copyWithIdentityActivations();
                            }
                        );
                        pheResolve( this.applicationActivations );
                    },
                    ( theError ) => {
                        pheReject( theError );
                    }
                );
        } );
    }





    deactivateAll(): Promise<IApplicationActivation[]> {
        console.log( "IdentitiesFilterPage deactivateAllIdentities" );
        return this.setActiveAllIdentities( false );
    }




    activateAll(): Promise<IApplicationActivation[]> {
        console.log( "IdentitiesFilterPage deactivateAllIdentities" );
        return this.setActiveAllIdentities( true );
    }




    setActiveAllIdentities( theActive: boolean ): Promise<IApplicationActivation[]> {
        if( !this.applicationActivations ) {
            return;
        }

        for( let anApplicationActivation of this.applicationActivations ) {
            anApplicationActivation.setActive( theActive );


            for( let anIdentityActivation of anApplicationActivation.identityActivations ) {
                anIdentityActivation.setActive( theActive );

            }
        }

        return this.commitActivations();
    }





    /* **********************************************************************
    The user has canceled the manipulation of application and identity activations.
    Close the modal.
    Do not submit any changes which may have been made to the isActive.
    */
    dismiss( data?: any ): Promise<any> {
        return this.viewCtrl.dismiss( data );
    }




    applyFilters(): Promise<IApplicationActivation[]> {

        if( !this.hasAnyActivationChanged()) {
            return Promise.resolve( this.applicationActivations);
        }

        return new Promise<IApplicationActivation[]>( ( pheResolve, pheReject ) => {
            this.commitActivations()
                .then(
                    ( theApplicationActivations: IApplicationActivation[] ) => {
                        if(theApplicationActivations)/*CQT*/{}

                        return this.dismiss( this.applicationActivations );
                    },
                    ( theError ) => {
                        throw theError;
                    }
                )
                .then(
                    () => {
                        pheResolve( this.applicationActivations );
                    },
                    ( theError) => {
                        pheReject( theError );
                    }
                );
        } );
    }






    hasAnyActivationChanged(): boolean {
        if( !( this.applicationActivations
            && this.applicationActivations_original)) {
            return false;
        }

        return ActivationsProvider.equalApplicationActivations(
            this.applicationActivations_original,
            this.applicationActivations);
    }



    commitActivations(): Promise<IApplicationActivation[]> {
        if( !this.applicationActivations ) {
            return;
        }
        return this.activationsProvider.commitActivations(
            this.applicationActivations
        );
    }


}
