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

import { Storage } from '@ionic/storage';

import {UserData} from '../../providers/user-data';
import { LoginPage } from '../login/login';
import { FlowTabsPage } from '../flow/flowtabs-page/flowtabs-page';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
    public userData: UserData
  ) { }

  startApp() {
      this.storage.set('hasSeenTutorial', 'true')
          .then(
              () => {
                  this.userData.hasLoggedIn()
                      .then(
                          (theHasLoggedIn) => {
                              if( theHasLoggedIn) {
                                  this.navCtrl.push( FlowTabsPage);
                              }
                              else {
                                  this.navCtrl.push( LoginPage);
                              }
                          },
                          ( theError) => {
                            console.log( "TutorialPage startApp this.userData.hasLoggedIn() error=" + theError);
                            throw theError;
                          });
              },
              ( theError) => {
                  console.log( "TutorialPage startApp this.storage.set('hasSeenTutorial', 'true') error=" + theError);
                  throw theError;
              }
          );
  }


  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
