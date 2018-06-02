/*
 * flowtabs-page.ts
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

import {NavParams} from 'ionic-angular';

import {InboxPage} from '../inbox/inbox';
import {DraftsPage} from "../drafts/drafts";
import {ArchivedPage} from "../archived/archived";
import {BouncedPage} from "../bounced/bounced";
import {TemplatesPage} from "../templates/templates";
import {OutboxPage} from "../outbox/outbox";


@Component({
    templateUrl: 'flowtabs-page.html'
})
export class FlowTabsPage {
    // set the root pages for each tab
    tab1Root: any = InboxPage;
    tab2Root: any = DraftsPage;
    tab3Root: any = ArchivedPage;
    tab4Root: any = BouncedPage;
    tab5Root: any = TemplatesPage;
    tab6Root: any = OutboxPage;

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }

}
