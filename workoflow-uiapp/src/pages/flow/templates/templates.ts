/*
 * templates.ts
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
}                              from 'ionic-angular';
import { ActivationsProvider } from "../../../providers/activations-provider";

import { FlowlistPage }       from "../flowlist/flowlist";
import { TemplateDetailPage } from '../template-detail/template-detail';
import { LoggedinProvider }   from "../../../providers/loggedin-provider";
import { Templatespec }       from '../../../interfaces/flow-templatespecs';
import { TemplatesFilter }    from "../../../filters/templates-filter";


@Component({
    selector: 'page-templates',
    templateUrl: 'templates.html'
})
export class TemplatesPage extends FlowlistPage {
    // Get the inboxList List and not a reference to the controller element
    @ViewChild('contentsListView', {read: List}) contentsList: List;


    public templatespecs: Templatespec[];
    public shownTemplates: Templatespec[];

    constructor(
        theApp: App,
        theAlertCtrl: AlertController,
        theModalCtrl: ModalController,
        theToastCtrl: ToastController,
        theLoadingCtrl: LoadingController,
        theNavCtrl: NavController,
        theLoggedinProvider: LoggedinProvider,
        theActivationsProvider: ActivationsProvider,
        public templatesFilter: TemplatesFilter
    ) {
        super(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider);

        this.flowboxTitle = "Templates";
        this.flowboxIcon  = "create";
        this.segment = "all";
        this.queryText = "";

        this.templatespecs  = [];
        this.shownTemplates = [];

        console.log( this.flowboxTitle + " constructor");
    }




    updateContent(): Promise<any> {
        return this.updateTemplates();
    }



    updateTemplates() {
        console.log("TemplatesPage updateTemplates");
        // Close any open sliding items when the schedule updates
        // seem to be synchronous! - probably just touches some variables
        this.contentsList && this.contentsList.closeSlidingItems();

        return new Promise<any>( ( resolver) => {
            this.templatesFilter.getTemplatespecs(this.queryText).subscribe((theTemplatespecs: Templatespec[]) => {
                this.templatespecs = theTemplatespecs;
                this.shownTemplates = this.templatespecs;
                console.log("templates.ts updateTemplates theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));

                resolver( this.templatespecs);
            });
        });
    }



    goToTemplateDetail(theTemplatespec: Templatespec) {
        // go to the session detail page
        // and pass in the session data

        this.navCtrl.push(TemplateDetailPage, {
            templatespec: theTemplatespec,
            name: theTemplatespec.name,
            key: theTemplatespec.key
        });
    }


}
