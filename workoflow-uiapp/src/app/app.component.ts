/*
 * app.component.ts
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

import {Component, ViewChild} from '@angular/core';
import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';

import {AboutPage} from '../pages/about/about';
import {LoginPage} from '../pages/login/login';
// import { MapPage } from '../pages/map/map';
import {SignupPage} from '../pages/signup/signup';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {SupportPage} from '../pages/support/support';

import {LogoutPage} from '../pages/flow/logout/logout';
import {AccountPage} from '../pages/flow/account/account';
import {FlowTabsPage} from '../pages/flow/flowtabs-page/flowtabs-page';
import {InboxPage} from '../pages/flow/inbox/inbox';
import {DraftsPage} from "../pages/flow/drafts/drafts";
import {ArchivedPage} from "../pages/flow/archived/archived";
import {BouncedPage} from "../pages/flow/bounced/bounced";
import {TemplatesPage} from "../pages/flow/templates/templates";
import {OutboxPage} from "../pages/flow/outbox/outbox";

import {UserData} from '../providers/user-data';

export interface PageInterface {
    title: string;
    name: string;
    component: any;
    icon: string;
    index?: number;
    tabName?: string;
    tabComponent?: any;
}

@Component({
    templateUrl: 'app.template.html'
})
export class WorkOFlowApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;


    rootPage: any;

    flowPages: PageInterface[] = [
        {
            title: 'Inbox',
            name: 'FlowTabsPage',
            component: FlowTabsPage,
            tabComponent: InboxPage,
            index: 0,
            icon: 'mail'
        },
        {
            title: 'Drafts',
            name: 'FlowTabsPage',
            component: FlowTabsPage,
            tabComponent: DraftsPage,
            index: 1,
            icon: 'mail-open'
        },
        {
            title: 'Archived',
            name: 'FlowTabsPage',
            component: FlowTabsPage,
            tabComponent: ArchivedPage,
            index: 2,
            icon: 'done-all'
        },
        {
            title: 'Bounced',
            name: 'FlowTabsPage',
            component: FlowTabsPage,
            tabComponent: BouncedPage,
            index: 3,
            icon: 'undo'
        },
        {
            title: 'Templates',
            name: 'FlowTabsPage',
            component: FlowTabsPage,
            tabComponent: TemplatesPage,
            index: 4,
            icon: 'create'
        },
        {
            title: 'Outbox',
            name: 'FlowTabsPage',
            component: FlowTabsPage,
            tabComponent: OutboxPage,
            index: 5,
            icon: 'send'
        }
    ];

    loggedInPages: PageInterface[] = [
        {title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person'},
        {title: 'Logout', name: 'LogoutPage', component: LogoutPage, icon: 'log-out'},
        {title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help'},
        {title: 'About', name: 'AboutPage', component: AboutPage, icon: 'information-circle'},
    ];

    loggedOutPages: PageInterface[] = [
        {title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in'},
        {title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add'},
        {title: 'About', name: 'AboutPage', component: AboutPage, icon: 'information-circle'}
    ];




    constructor(
        public events: Events,
        public userData: UserData,
        public menu: MenuController,
        public platform: Platform,
        public storage: Storage,
        public splashScreen: SplashScreen
    ) {

        // Check if the user has already seen the tutorial
        this.storage.get('hasSeenTutorial')
            .then((hasSeenTutorial) => {
                if (hasSeenTutorial) {
                    this.rootPage = LoginPage; // FlowTabsPage TabsPage
                } else {
                    this.rootPage = TutorialPage;
                }
                this.platformReady()
            });

        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then(
            ( pheIsLoggedIn ) => {
                this.enableMenu(pheIsLoggedIn === true);
            },
            ( theError) => {
                console.log( "Error in app.component.ts constructor this.userData.hasLoggedIn()" + theError);
                this.enableMenu(false);
            }
        );

        this.listenToLoginEvents();
    }



    openPage(page: PageInterface) {
        let params = {};

        // the nav component was found using @ViewChild(Nav)
        // setRoot on the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            params = {tabIndex: page.index};
        }

        // If we are already on tabs just change the selected tab
        // don't setRoot again, this maintains the history stack of the
        // tabs even if changing them from the menu
        if (this.nav.getActiveChildNavs().length && page.index != undefined) {
            this.nav.getActiveChildNavs()[0].select(page.index);
        } else {
            // Set the root of the nav with params if it's a tab index
            this.nav.setRoot(page.name, params).catch((err: any) => {
                console.log(`Didn't set nav root: ${err}`);
            });
        }
    }




    logout() : Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject) => {
            if(pheReject){}/*CQT*/
            this.userData.logout()
                .then(
                    ( ) => {
                        return this.nav.setRoot( LoginPage);
                    },
                    ( theError) => {
                        if(theError){}/*CQT*/
                        throw theError;
                    }
                )
                .then(
                    ( ) => {
                        pheResolve();
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }



    openTutorial() {
        this.nav.setRoot(TutorialPage)/*CQT*/.then(()=>{});
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
        });
    }

    enableMenu(loggedIn: boolean) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }

    platformReady() {
        // Call any initial plugins when ready
        this.platform.ready().then(() => {
            this.splashScreen.hide();
        });
    }

    isActive(page: PageInterface) {
        let childNav = this.nav.getActiveChildNavs()[0];

        // Tabs are a special case because they have their own navigation
        if (childNav) {
            if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
                return 'primary';
            }
            return;
        }

        if (this.nav.getActive() && this.nav.getActive().name === page.name) {
            return 'primary';
        }
        return;
    }
}
