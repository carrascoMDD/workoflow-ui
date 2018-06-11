/*
 * user-data.ts
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

import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {IAuthentication} from "../interfaces/flow-iauthentication";

import {LoginsProvider} from "./logins-provider";
import {ILogin} from "../interfaces/flow-ilogins";


type PromiseResolve_any = ( value: any) => void;


@Injectable()
export class LoggedinProvider {

    static HAS_LOGGED_IN = 'hasLoggedIn';
    static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

    isDoingLogin = false;
    waitingForLoginDone: PromiseResolve_any[];

    authenticatedLogin: ILogin;

    constructor(
        public events: Events,
        public storage: Storage,
        public loginsProvider: LoginsProvider
    ) {
        this.isDoingLogin = false;
        this.waitingForLoginDone = [ ];
        this.authenticatedLogin = null;
    }




    resolveAllWaitingForLoginProcessing(): void {
        if( this.waitingForLoginDone) {
            for( let aPromise of this.waitingForLoginDone) {
                aPromise( null);
            }
        }
        this.waitingForLoginDone = null;
    }





    toWaitForLoginProcessing(): Promise<any[]> {

        return new Promise<any[]>( (resolve) => {
            if( !this.waitingForLoginDone) {
                this.waitingForLoginDone = [];
            }
            this.waitingForLoginDone.push( resolve);
        });
    }





    authenticationPerformed( theAuthentication: IAuthentication): Promise<any> {
        this.authenticatedLogin     = null;

        if( !theAuthentication || !theAuthentication._v_Success) {
            return Promise.resolve( theAuthentication);
        }


        /* ************************************************************
        Avoid other clients or subscribers to launch resolution of identityActivations
        when already on its (asynchronous) way.
        */
        this.isDoingLogin = true;
        this.waitingForLoginDone = [ ];

        return new Promise<IAuthentication>( (resolve) => {

            this.loginsProvider.getAllLogins().subscribe(

                ( theLogins: ILogin[]) => {

                    this.authenticatedLogin     = null;

                    for( let aLogin of theLogins) {
                        if( aLogin && ( aLogin.login === theAuthentication.login)) {
                            this.authenticatedLogin = aLogin;
                            break;
                        }
                    }

                    /* ************************************************************
                    If not found a login matching the authenticated
                    then do not build the list of identityActivations with active state from storage.
                    */
                    if( !this.authenticatedLogin) {
                        this.isDoingLogin = false;
                        this.resolveAllWaitingForLoginProcessing();
                        this.events.publish('user:logout');
                        resolve( theAuthentication);
                        return;
                    }




                    /* ************************************************************
                    Retrieve from local store the application key - identity key pairs
                    which the logged in user did select as active sometime in the past,
                    saving the User the need  to activate manually often-used identities at the beginning of work sessions.
                    Stored as an array of elements with IApplicationActivation - like layout:
                        applicationKey: string;
                        identityKey: string;
                        active: boolean;

                    let aStorageKey = STOREKEYPREFIX +  theAuthentication.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
                    this.storage.get( aStorageKey).then(( theStoredIdentityActivations) => {
                        // ? is it a string or an object ?
                        if( theStoredIdentityActivations) {
                            for( let anStoredIdentityActivation of theStoredIdentityActivations) {
                                if( !anStoredIdentityActivation) {
                                    continue;
                                }

                                if( !anStoredIdentityActivation.applicationKey || !anStoredIdentityActivation.identityKey) {
                                    continue;
                                }

                                const someApplicationIdentityActivations = someIdentityActivationsByKeys[ anStoredIdentityActivation.applicationKey];
                                if( someApplicationIdentityActivations) {
                                    const anApplicationIdentityActivation = someApplicationIdentityActivations[ anStoredIdentityActivation.identityKey];
                                    if( anApplicationIdentityActivation) {
                                        anApplicationIdentityActivation.setActive( anStoredIdentityActivation.active === true);
                                    }
                                }
                            }
                        }

                        this.isDoingLogin = false;
                        this.resolveAllWaitingForLoginProcessing();
                        this.events.publish('user:login');
                        resolve( theAuthentication);
                    });
*/
                }
            );
        });
    }







    signup(username: string): Promise<any> {
        if(username){}/*CQT
        this.storage.set(this.HAS_LOGGED_IN, true);*/
        this.events.publish('user:signup');
        return Promise.resolve( username);
    }





    logout(): Promise<any> {
        return new Promise<any>( ( pheResolve, pheReject) => {
            if(pheReject){}/*CQT*/

            this.authenticatedLogin = null;
            this.isDoingLogin = false;
            this.waitingForLoginDone = null;

            this.events.publish('user:logout');

            pheResolve( true);
        });
    }







    hasLoggedIn(): Promise<boolean> {
        return new Promise<boolean>( ( pheResolve, pheReject) => {
            this.getAuthenticatedLogin( )
                .then(
                    ( theLogin) => {
                        pheResolve( !( typeof theLogin === "undefined") && !(theLogin === null));
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }



    getAuthenticatedLogin(): Promise<ILogin> {
        return Promise.resolve( this.authenticatedLogin);
    }







}
