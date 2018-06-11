/*
 * tutorial.ts
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

import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { StorageProvider }  from '../../storage/storage-provider';
import { LoggedinProvider } from '../../providers/loggedin-provider';
import { LoginPage }        from '../login/login';
import { FlowTabsPage }     from '../flow/flowtabs-page/flowtabs-page';



@Component( {
    selector:    'page-tutorial',
    templateUrl: 'tutorial.html'
} )
export class TutorialPage {

    // sub-views to be managed by a Slides controller
    @ViewChild( 'slides' ) slides: Slides;


    // Assist the template to determine whether at the end of the slides or not
    showSkip = true;



    constructor(
        public navCtrl: NavController,
        public menu: MenuController,
        public storageProvider: StorageProvider,
        public loggedinProvider: LoggedinProvider
    ) {
        console.log( "TutorialPage constructor");
    }



    /* **********************************************************************
    Inform the slider that the child slides have changed (as when opening this page)
    */
    ionViewWillEnter() {
        this.slides.update();
    }




    /* **********************************************************************
    Persist in some storage local to the user's browser and device
        the fact that the user has already visited the tutorial.

    If the user is logged in
        then visit the first of the flowTabs pages
        else visit the login page
    */
    tutorialCompleted(): Promise<any> {
        return new Promise( ( pheResolve, pheReject ) => {

            this.storageProvider.persist_HAS_SEEN_TUTORIAL( true)
                .then(
                    () => {
                        return this.loggedinProvider.hasLoggedIn();
                    },
                    ( theError ) => {
                        console.log( "TutorialPage tutorialCompleted this.persist_HAS_SEEN_TUTORIAL error=" + theError );
                        throw theError;
                    }
                )
                .then(
                    ( theHasLoggedIn ) => {
                        if( theHasLoggedIn ) {
                            console.log( "TutorialPage tutorialCompleted this.loggedinProvider.hasLoggedIn() true setting FlowTabsPage as root" );
                            return this.navCtrl.setRoot( FlowTabsPage, { tabIndex: 0});
                        }
                        else {
                            console.log( "TutorialPage tutorialCompleted this.loggedinProvider.hasLoggedIn() false setting LoginPage as root" );
                            return this.navCtrl.setRoot( LoginPage );
                        }
                    },
                    ( theError ) => {
                        throw theError;
                    }

                )
                .then(
                    () => {
                        pheResolve();
                    },
                    ( theError ) => {
                        pheReject( theError);
                    }
                );
        });
    }



    /* **********************************************************************
    Assist the template to determine whether at the end of the slides or not
    */
    onSlideChangeStart( slider: Slides ) {
        this.showSkip = !slider.isEnd();
    }



}
