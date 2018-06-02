/*
 * template-detail.ts
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
import { NavParams } from 'ionic-angular';

import { TemplatesProvider } from '../../../providers/templates-provider';
import {Templatespec} from "../../../interfaces/flow-templatespecs";

@Component({
  selector: 'page-template-detail',
  templateUrl: 'template-detail.html'
})
export class TemplateDetailPage {
  template: Templatespec;

  constructor(
    public templatesProvider : TemplatesProvider,
    public navParams: NavParams
  ) {
    console.log( "TemplateDetailPage constructor");
  }

  ionViewWillEnter() {
    this.templatesProvider.load().subscribe(( theTemplatespecs:  Templatespec[]) => {
      for ( const aTemplatespec of theTemplatespecs) {
        if ( aTemplatespec && aTemplatespec.key === this.navParams.data.key) {
          this.template = aTemplatespec;
          break;
        }
      }
    });
  }
}
