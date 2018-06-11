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

import { enableProdMode }                             from '@angular/core';
import { Component, ViewChild }                       from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen }                               from '@ionic-native/splash-screen';

import { AboutPage }        from '../pages/about/about';
import { LoginPage }        from '../pages/login/login';
import { SignupPage }       from '../pages/signup/signup';
import { TutorialPage }     from '../pages/tutorial/tutorial';
import { SupportPage }      from '../pages/flow/support/support';
import { LogoutPage }       from '../pages/flow/logout/logout';
import { AccountPage }      from '../pages/flow/account/account';
import { FlowTabsPage }     from '../pages/flow/flowtabs-page/flowtabs-page';
import { InboxPage }        from '../pages/flow/inbox/inbox';
import { DraftsPage }       from "../pages/flow/drafts/drafts";
import { ArchivedPage }     from "../pages/flow/archived/archived";
import { BouncedPage }      from "../pages/flow/bounced/bounced";
import { TemplatesPage }    from "../pages/flow/templates/templates";
import { OutboxPage }       from "../pages/flow/outbox/outbox";
import { LoggedinProvider } from '../providers/loggedin-provider';
import { StorageProvider }  from "../storage/storage-provider";


/* ACV OJO DEBUG mode is default for Angular */
const ENABLEPRODMODE = true;

if( ENABLEPRODMODE ) {
    enableProdMode();
}






export interface PageInterface {
    title: string;
    name: string;
    component: any;
    icon: string;
    index?: number;
    tabName?: string;
    tabComponent?: any;
}






@Component(
    {
        templateUrl: 'app.template.html'
    }
)
export class WorkOFlowApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild( Nav ) nav: Nav;

    static DOMID_MENU_LOGGEDIN  = 'domid_menu_loggedIn';
    static DOMID_MENU_LOGGEDOUT = 'domid_menu_loggedOut';


    // Keep the resolution value from storage retrieve has seen tutorial promise, just in case it comes handy later
    hasSeenTutorial: any;

    // Keep the resolution value from platform.ready() promise, just in case it comes handy later
    readySource: any;

    // rootPage is variable interpolated for the root nav in the app.template.html
    //   <!-- main navigation -->
    //   <ion-nav [root]="rootPage" #content swipeBackEnabled="false" main name="app"></ion-nav>
    rootPage: any;

    /* **********************************************************************
    Groups of Pages rendered as sectopms in the menu items
        each menu item triggering upon user click the visit to the corresponding page
    flowPages items are always rendered, shall display in the menu as disabled when the user is not logged in
    loggedInPages, loggedOutPages items are only rendered on the corresponding user logged status
    alwaysPages items are always rendered
    An item linking to an additional TutorialPage is always shown at the bottom of the menu whether the user is logged in or not
    */
    flowPages: PageInterface[] = [
        { title: 'Inbox', name: 'FlowTabsPage', component: FlowTabsPage, tabComponent: InboxPage, index: 0, icon: 'mail' },
        { title: 'Drafts', name: 'FlowTabsPage', component: FlowTabsPage, tabComponent: DraftsPage, index: 1, icon: 'mail-open' },
        { title: 'Archived', name: 'FlowTabsPage', component: FlowTabsPage, tabComponent: ArchivedPage, index: 2, icon: 'done-all' },
        { title: 'Bounced', name: 'FlowTabsPage', component: FlowTabsPage, tabComponent: BouncedPage, index: 3, icon: 'undo' },
        { title: 'Templates', name: 'FlowTabsPage', component: FlowTabsPage, tabComponent: TemplatesPage, index: 4, icon: 'create' },
        { title: 'Outbox', name: 'FlowTabsPage', component: FlowTabsPage, tabComponent: OutboxPage, index: 5, icon: 'send' }
    ];

    loggedInPages: PageInterface[] = [
        { title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person' },
        { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
        { title: 'Logout', name: 'LogoutPage', component: LogoutPage, icon: 'log-out' }
    ];

    loggedOutPages: PageInterface[] = [
        { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
        { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
    ];

    alwaysPages: PageInterface[] = [
        { title: 'About', name: 'AboutPage', component: AboutPage, icon: 'information-circle' }
    ];



    /* **********************************************************************
    Create the root application instance.
    Delegate to initialise its members and perform any required setup and checks.
    Show/hide menu according to the user logged in status.
    Present the appropriate page as the first the user shall see.
    */
    constructor(
        public events: Events,
        public loggedinProvider: LoggedinProvider,
        public menu: MenuController,
        public platform: Platform,
        public storageProvider: StorageProvider,
        public splashScreen: SplashScreen
    ) {

        // The result of the constructor is the new instance of WorkOFlowApp, so no promise or result returned.
        this.initWorkOFlowApplication()/*CQT*/.then(()=>{},(theError) => { throw theError;});
    }




    /* **********************************************************************
    Create the root application instance,
    initialise its members and perform any required setup and checks,
    present the appropriate page as the first the user shall see.
    ***************************
    SHOW TUTORIAL OR LOGIN PAGE
    If the user had already seen the Tutorial,
        as posibly reflected in the local storage of the specific device/computer and browser being used
    then
        show the LoginPage
    else (no record exists in local storage of the user having already seen the Tutorial)
        show the TutorialPage
    ***************************
    WAIT FOR PLATFORM TO BE READY, AND KEEP THE PLATFORM INFO
    ***************************
    DISABLE MENU
    ***************************
    SUBSCRIBE TO EVENTS WHICH WOULD CHANGE THE MENU ENABLEMENT
    */
    initWorkOFlowApplication(): Promise<any> {
        return new Promise( ( pheResolve, pheReject ) => {


            this.storageProvider.retrieve_HAS_SEEN_TUTORIAL()
                .then(
                    ( theHasSeenTutorial ) => {

                        // Keep the resolution value from storage retrieve has seen tutorial promise, just in case it comes handy later
                        this.hasSeenTutorial = theHasSeenTutorial;

                        /* **********************************************************************
                        rootPage is the variable in the interpolation of the root nav in the app.template.html
                          <!-- main navigation -->
                          <ion-nav [root]="rootPage" #content swipeBackEnabled="false" main name="app"></ion-nav>
                       */
                        if( theHasSeenTutorial ) {
                            this.rootPage = LoginPage; // FlowTabsPage TabsPage
                        }
                        else {
                            this.rootPage = TutorialPage;
                        }

                        return this.platformReady();
                    },
                    ( theError ) => {
                        throw theError;
                    }
                )
                .then(
                    ( theReadySource ) => {
                        // Keep the resolution value from platform.ready() promise, just in case it comes handy later
                        this.readySource = theReadySource;

                        // Initially disable menu until the user is logged in
                        // which shall happen from LoginPage, whether by manual input by the user
                        // or some automated mechanism for login in demo or test automation
                        this.enableMenu( false );

                        // Shall enable or disable menu when events happen (shall be disabled until sucessful login).
                        this.listenToLoginEvents();

                        return Promise.resolve( theReadySource );
                    },
                    ( theError ) => {
                        throw theError;
                    }
                )
                // Deal with, or transform final result, if needed.
                .then(
                    ( theReadySource ) => {
                        pheResolve( theReadySource);
                    },
                    ( theError ) => {
                        console.log( "Error in WorkOFlowApp initWorkOFlowApplication " + theError );
                        pheReject( theError);
                    }
                );
        });
    }




    /* **********************************************************************
    When the platform is ready:
        Hide splash screen
        ... more ?
    Returns a promise which shall be resolved with the platform ready source
    */
    platformReady(): Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject ) => {

            // Call any initial plugins when ready
            this.platform.ready()
                .then(
                    ( theReadySource ) => {

                        this.splashScreen.hide();

                        return Promise.resolve( theReadySource );
                    },
                    ( theError ) => {
                        console.log( "Error in WorkOFlowApp platformReady this.platform.ready()" + theError );
                        throw( theError );
                    }
                )
                /*
                // Example on how to leave room for other stuff to happen here
                //   which may likely come to happen in the future, as the development progresses.
                .then(
                    ( theReadySource) => {
                        return Promise.resolve( theReadySource);
                    },
                    ( theError) => {
                        // console.log( "Error in WorkOFlowApp platformReady " + theError);
                        throw( theError);
                    }
                )
                */
                // Deal with final result, if needed.
                .then(
                    ( theReadySource ) => {
                        pheResolve( theReadySource );
                    },
                    ( theError ) => {
                        // console.log( "Error in WorkOFlowApp platformReady " + theError);
                        pheReject( theError );
                    }
                );
        } );
    }




    enableMenu( loggedIn: boolean ) {
        this.menu.enable( loggedIn, WorkOFlowApp.DOMID_MENU_LOGGEDIN );
        this.menu.enable( !loggedIn, WorkOFlowApp.DOMID_MENU_LOGGEDOUT );
    }




    listenToLoginEvents() {
        this.events.subscribe( 'user:login', () => {
            this.enableMenu( true );
            console.log( "WorkOFlowApp received event user:login");
        } );

        this.events.subscribe( 'user:signup', () => {
            this.enableMenu( true );
            console.log( "WorkOFlowApp received event user:signup");
        } );

        this.events.subscribe( 'user:logout', () => {
            this.enableMenu( false );
            console.log( "WorkOFlowApp received event user:logout");
        } );
    }




    /* **********************************************************************
    Opens a view on the instance of page supplied in the PageInterface specification. Cases:

    Current view already is flowTabs ( because there is at least one getActiveChildNavs):

        Requested PageInterface has a index property, therefore the PageInterface is one of the tabs in flowTabs
            then just the the tab index in the flowtabs sub-navigator controller, do not change root page

        Requested Page is not one of the flowTabs
            then set as root the view registered under the name property of the requested ResquesterPage

    Current view is not flowTabs:
            then set as root the view registered under the name property of the requested ResquesterPage

            if the requested PageInterface has an index property
                then it is assumed (by flowPages, loggedInPages, loggedOutPages, alwaysPages  initialised above)
                    that the requested page
                    is one of the flowtabs
                    the component to actually instantiate is FlowTabsPage
                        as given in property component: of the requested PageInterface
                    the FlowTabsPage upon activation shall instantiate as sub-view
                        the component specified by property tabComponent in the requested PageInterface
                    the index corresponds to the tab index in the flowtabs sub-navigator controller

    See in FlowTabsPage and corresponding template
        how the various tabs are interpolated and rendered
            <ion-tab [root]="tab1Root" flowboxTitle="Inbox" tabIcon="mail" tabUrlPath="inbox"></ion-tab>
            <ion-tab [root]="tab2Root" flowboxTitle="Drafts" tabIcon="mail-open" tabUrlPath="drafts"></ion-tab>
            <ion-tab [root]="tab3Root" flowboxTitle="Archived" tabIcon="done-all" tabUrlPath="archived"></ion-tab>
            <ion-tab [root]="tab4Root" flowboxTitle="Bounced" tabIcon="undo" tabUrlPath="bounced"></ion-tab>
            <ion-tab [root]="tab5Root" flowboxTitle="Templates" tabIcon="create" tabUrlPath="templates"></ion-tab>
            <ion-tab [root]="tab6Root" flowboxTitle="Outbox" tabIcon="send" tabUrlPath="outbox"></ion-tab>
        and bound to specific instances
            tab1Root: any = InboxPage;
            tab2Root: any = DraftsPage;
            tab3Root: any = ArchivedPage;
            tab4Root: any = BouncedPage;
            tab5Root: any = TemplatesPage;
            tab6Root: any = OutboxPage;
    */
    openPage( page: PageInterface ): Promise<any> {

        return new Promise( ( pheResolve, pheReject ) => {

            // Current view is flowTabs and requested PageInterface has index property and therefore is one of the flowTabs
            // just set tab index
            if( this.nav.getActiveChildNavs().length && page.index != undefined ) {
                this.nav.getActiveChildNavs()[ 0 ].select( page.index );
                return;
            }



            // Current view is not flowTabs, or requested PageInterface does not have index property and therefore is not one of the flowTabs
            let params = {};

            // Requested PageInterface has index property
            // it shall be used by flowTabs controller to choose the sub-view to present
            //    whether the current view is already flowTabs or not
            // it is assumed initialisations above flowPages, loggedInPages, loggedOutPages, alwaysPages
            //    that the requested page  component to actually instantiate is FlowTabsPage
            if( page.index ) {
                params = { tabIndex: page.index };
            }

            // Set as root the view registered under the name property of the requested ResquesterPage
            // if the page is FlowTabsPage, hopefully params holds an index for the tab to present
            this.nav.setRoot( page.name, params )
                .then(
                    ( theSetRootResult ) => {
                        pheResolve( theSetRootResult);
                    },
                    ( theError) => {
                        console.log( "Error in WorkOFlowApp openPage this.nav.setRoot( " + ( page.name || "?") + ")  Error=" + theError );
                        pheReject( theError);
                    }
                )
            }
        );
    }





    /* **********************************************************************
    Determines whether a page is active or not such that the menu may display an item as enabled or disabled.

    Handle the two different cases of flowTab pages, and non-flowTab pages.
    */
    isActive( page: PageInterface ) {

        const aChildNav = this.nav.getActiveChildNavs()[ 0 ];

        // Tabs are a special case because they have their own navigation
        if( aChildNav ) {
            if(      aChildNav.getSelected()
                && ( aChildNav.getSelected().root === page.tabComponent )) {
                return 'primary';
            }
            return;
        }

        if( this.nav.getActive() && this.nav.getActive().name === page.name ) {
            return 'primary';
        }
        return;
    }





    /* **********************************************************************
    Exposed here for convenience of executing logout
    Expected, but not tested, to be used from views, which can get a reference to this root.
    Not sure if this instance is what views get injected in
    constructor(
        theApp: App,
    */
    logout(): Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject ) => {
            this.loggedinProvider.logout()
                .then(
                    () => {
                        return this.nav.setRoot( LoginPage );
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
                        pheReject( theError );
                    }
                );
        } );
    }





    /* **********************************************************************
    Invoked from menu item
     */
    openTutorial(): Promise<any> {
       return this.nav.setRoot( TutorialPage );
    }



}
