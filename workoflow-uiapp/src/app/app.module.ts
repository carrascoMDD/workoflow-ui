/*
 * app.module.ts
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

import {BrowserModule} from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';

import {WorkOFlowApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {PopoverPage} from '../pages/about-popover/about-popover';
import {AccountPage} from '../pages/flow/account/account';
import {LoginPage} from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {SupportPage} from '../pages/support/support';

import {UserData} from '../providers/user-data';

import {LogoutPage} from '../pages/flow/logout/logout';
import {IdentitiesFilterPage} from "../pages/flow/identities-filter/identitites-filter";
import {FlowHeader} from "../pages/flow/flow-header/flow-header";
import {FlowTabsPage} from '../pages/flow/flowtabs-page/flowtabs-page';
import {InboxPage} from '../pages/flow/inbox/inbox';
import {DraftsPage} from "../pages/flow/drafts/drafts";
import {ArchivedPage} from '../pages/flow/archived/archived';
import {BouncedPage} from "../pages/flow/bounced/bounced";
import {TemplatesPage} from "../pages/flow/templates/templates";
import {TemplateDetailPage} from '../pages/flow/template-detail/template-detail';
import {OutboxPage} from "../pages/flow/outbox/outbox";

import {AuthenticationProvider} from '../providers/authentication-provider';
import {LoginsProvider} from "../providers/logins-provider";
import {ApplicationsProvider} from "../providers/applications-provider";
import {TemplatesProvider} from "../providers/templates-provider";
import {TemplatesFilter} from "../filters/templates-filter";
import {FlowboxPage} from "../pages/flow/flowbox/flowbox";


@NgModule({
    declarations: [
        WorkOFlowApp,
        AboutPage,
        AccountPage,
        LoginPage,
        PopoverPage,
        SignupPage,
        TutorialPage,
        SupportPage,

        LogoutPage,
        FlowTabsPage,
        IdentitiesFilterPage,
        FlowHeader,
        FlowboxPage,
        InboxPage,
        DraftsPage,
        ArchivedPage,
        BouncedPage,
        TemplatesPage,
        TemplateDetailPage,
        OutboxPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        IonicModule.forRoot(WorkOFlowApp, {}, {
            links: [
                {component: AboutPage, name: 'AboutPage', segment: 'about'},
                {component: TutorialPage, name: 'Tutorial', segment: 'tutorial'},
                {component: SupportPage, name: 'SupportPage', segment: 'support'},
                {component: LoginPage, name: 'LoginPage', segment: 'login'},
                {component: AccountPage, name: 'AccountPage', segment: 'account'},
                {component: SignupPage, name: 'SignupPage', segment: 'signup'},

                {component: LogoutPage, name: 'LogoutPage', segment: 'logout'},
                {component: FlowTabsPage, name: 'FlowTabsPage', segment: 'flowtabs-page'},
                {component: InboxPage, name: 'Inbox', segment: 'inbox'},
                {component: DraftsPage, name: 'Drafts', segment: 'drafts'},
                {component: ArchivedPage, name: 'Archived', segment: 'archived'},
                {component: BouncedPage, name: 'Bounced', segment: 'bounced'},
                {component: TemplatesPage, name: 'Templates', segment: 'templates'},
                {component: TemplateDetailPage, name: 'TemplateDetail', segment: 'templateDetail/:templateKey'},
                {component: OutboxPage, name: 'Outbox', segment: 'outbox'}
            ]
        }),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        WorkOFlowApp,
        AboutPage,
        AccountPage,
        LoginPage,
        PopoverPage,
        SignupPage,
        TutorialPage,
        SupportPage,

        FlowTabsPage,
        LogoutPage,
        FlowHeader,
        FlowboxPage,
        IdentitiesFilterPage,
        InboxPage,
        DraftsPage,
        ArchivedPage,
        BouncedPage,
        TemplatesPage,
        TemplateDetailPage,
        OutboxPage
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        UserData,
        InAppBrowser,
        SplashScreen,

        LoginsProvider,
        AuthenticationProvider,
        ApplicationsProvider,
        TemplatesProvider,
        TemplatesFilter
    ]
})
export class AppModule {
}
