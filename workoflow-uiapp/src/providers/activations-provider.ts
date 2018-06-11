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

import {Storage} from '@ionic/storage';
import {IAuthentication} from "../interfaces/flow-iauthentication";

import {LoginsProvider} from "./logins-provider";
import {ILogin} from "../interfaces/flow-ilogins";
import {ApplicationActivation, IdentityActivation} from "../interfaces/flow-activations";
import {IApplicationActivation, IIdentityActivation} from "../interfaces/flow-iactivations";



export type ActivationsChangedHandler = ( value: IApplicationActivation[]) => Promise<void>;



@Injectable()
export class ActivationsProvider {

    static STOREKEYSEPARATORTOREPLACE = /_-_/g;
    static STOREKEYSEPARATORTOREPLACEMENT = "=-=";
    static STOREKEYPREFIX = "ACTIVEAPPLICATIONIDENTITIES";

    static APPLICATION_ISACTIVE_INITIAL = false;
    static IDENTITY_ISACTIVE_INITIAL    = false;


    static MAXAPPLICATIONACTIVATIONSSQUARE = 256;
    static MAXIDENTITYACTIVATIONSSQUARE    = 256;


    static storeKey_applicationActivationsForLogin( theLogin: ILogin): string {
        if( !( theLogin && theLogin.login)) {
            return null;
        }

        const aReplacedLogin = theLogin.login.replace(
            ActivationsProvider.STOREKEYSEPARATORTOREPLACE,
            ActivationsProvider.STOREKEYSEPARATORTOREPLACEMENT);

        return ActivationsProvider.STOREKEYPREFIX + aReplacedLogin;

    }




    login: ILogin;
    applicationActivations: ApplicationActivation[];
    activationsChangedHandlers : ActivationsChangedHandler[];


    constructor(
        public storage: Storage,
        public loginsProvider: LoginsProvider
    ) {
        this.login = null;
        this.applicationActivations = [ ];
        this.activationsChangedHandlers = [ ];
    }



    registerInterest_activationsChanged( theHandler: ActivationsChangedHandler): void {
        if( !theHandler) {
            return;
        }
        if( !this.activationsChangedHandlers) {
            this.activationsChangedHandlers = [ ];
        }
        this.activationsChangedHandlers.push( theHandler);
    }




    getApplicationActivations(): Promise<IApplicationActivation[]> {

        return Promise.resolve( this.copyOfApplicationActivations());
    }




    propagate_activationsChanged(): Promise<void> {

        if( !this.activationsChangedHandlers || !this.activationsChangedHandlers.length) {
            return Promise.resolve();
        }

        /* ************************************************************
        Return a Promise which shall be fulfilled after the chained fulfillement of all the change handlers
         */
        return new Promise<void>( (resolveTop) => {

            let aFirstResolve = null;
            let aFirstPromise = new Promise<void>( ( pheResolve) => {
                aFirstResolve = pheResolve;
            });

            let aPreviousPromise = aFirstPromise;

            /* ************************************************************
            Each handler executed after the fulfillement
            of aPreviousPromise which is either the first promise or the resulting promise of the previous handler,
            therefore the propagation of changes to the handlers starts upon fulfillement of the first promise
            done imperatively at the bottom of this method,
            and chains one after the other.
            After the last one, the promise returned by this propagate method is fullfilled,
            just in case somebody is waiting to do something
            after the change propagation completes.
            */
            for( let anactivationsChangedHandler of this.activationsChangedHandlers) {
                aPreviousPromise = aPreviousPromise.then(
                    () => {
                        return anactivationsChangedHandler( this.copyOfApplicationActivations());
                    },
                    () => {
                        return anactivationsChangedHandler( this.copyOfApplicationActivations());
                    }
                );
            }

            /* ************************************************************
            Sanity check, should not happen because of the check done at the top of the method on
            this.activationsChangedHandlers.length
            and would anyway be handled properly by (empty but for the initial) chaining execution.
            */
            if( aPreviousPromise === aFirstPromise) {
                resolveTop( );
                return;
            }

            aPreviousPromise.then(
               () => {
                   resolveTop();
               },
               () => {
                   resolveTop();
               }
            );

            /* ************************************************************
            Start propagating by resolving the first Promise
            */
             aFirstResolve();
        });
    }







    retrieveApplicationActivations( theAuthentication: IAuthentication, theLogin: ILogin): Promise<IApplicationActivation[]> {

        this.applicationActivations = null;

        if( !theAuthentication || !theAuthentication._v_Success) {
            return Promise.resolve( null);
        }

        if( !theLogin || !theLogin.loginApplications || !theLogin.loginApplications.length) {
            return Promise.resolve( null);
        }

        this.login = theLogin;

        return new Promise<IApplicationActivation[]>( ( pheResolve, pheReject) => {

            /* ************************************************************
            Build the list of applicationActivations with active state from storage.
            Create non-active IdentityActivations for all the LoginApplication in the Login
            matching theAuthentication.login
            Index the identityActivations by application key and identity key
            to avoid N*N complexity in match with stored key pairs, below.
            */
            let someInitialApplicationActivations = null;
            this.initApplicationActivations( theLogin)
                .then(
                    ( theInitialApplicationActivations: IApplicationActivation[]) => {
                        someInitialApplicationActivations = theInitialApplicationActivations;
                        return this.retrieveStoredApplicationActivations( theLogin);
                    },
                    ( theError) => {
                        throw theError;
                    }
                )
                .then(
                    ( theStoredApplicationActivations: IApplicationActivation[]) => {

                        return ActivationsProvider.mergeApplicationActivations(
                            theStoredApplicationActivations,
                            someInitialApplicationActivations
                        );
                    },
                    ( theError) => {
                        throw theError;
                    }
                )
                .then(
                    ( theMergedApplicationActivations: IApplicationActivation[]) => {
                        this.applicationActivations = theMergedApplicationActivations;
                        pheResolve( this.applicationActivations);
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );

        });
    }





    /* ************************************************************
    Build the list of ApplicationActivations and their IdentityActivations
    with active state from storage.
    Create non-active IdentityActivations for all the LoginApplication in the authenticatedLogin.
    */
    initApplicationActivations( theLogin: ILogin): Promise<IApplicationActivation[]> {
        return new Promise<IApplicationActivation[]>( ( pheResolve) => {

            this.applicationActivations = [ ];

            for( let aLoginApplication of theLogin.loginApplications) {

                if( !( aLoginApplication
                    && aLoginApplication.applicationKey
                    && aLoginApplication.identityKeys
                    && aLoginApplication.identityKeys.length)) {
                    continue;
                }

                const anApplicationActivation = new ApplicationActivation(
                    theLogin.login,
                    aLoginApplication.applicationKey,
                    ActivationsProvider.APPLICATION_ISACTIVE_INITIAL
                );

                for( let anIdentityKey of aLoginApplication.identityKeys) {

                    const anIdentityActivation = new IdentityActivation(
                        anApplicationActivation,
                        anIdentityKey,
                        ActivationsProvider.IDENTITY_ISACTIVE_INITIAL
                    );
                    anApplicationActivation.addIdentityActivation( anIdentityActivation);
                }
            }

            pheResolve( this.applicationActivations);
        });
    }







    /* ************************************************************
    Retrieve from local store the application key - identity key pairs
    which the logged in user did select as active sometime in the past,
    saving the User the need  to activate manually often-used identities at the beginning of work sessions.
    Stored as an array of elements with IApplicationActivation with nested IIdentityActivation[]
    */
    retrieveStoredApplicationActivations( theLogin: ILogin): Promise<IApplicationActivation[]> {
        return new Promise<IApplicationActivation[]>( ( pheResolve, pheReject) => {

            let aStorageKey = ActivationsProvider.storeKey_applicationActivationsForLogin( theLogin);
            if( !aStorageKey) {
                pheReject( "ERROR computing store key for application activations, or the user is not logged in");
                return;
            }

            const someApplicationActivations: IApplicationActivation[] = [ ];

            this.storage.get( aStorageKey)
                .then(
                    ( theStoredApplicationActivations) => {
                        if( !theStoredApplicationActivations) {
                            pheResolve( null);
                            return;
                        }

                        for( let aStoredApplicationActivation of theStoredApplicationActivations) {
                            if( !( aStoredApplicationActivation
                                && aStoredApplicationActivation.login
                                && aStoredApplicationActivation.applicationKey)) {
                                continue;
                            }

                            const anApplicationActivation = new ApplicationActivation(
                                aStoredApplicationActivation.login,
                                aStoredApplicationActivation.applicationKey,
                                aStoredApplicationActivation.isActive,
                                aStoredApplicationActivation
                            );

                            someApplicationActivations.push( anApplicationActivation);
                        }

                        pheResolve( someApplicationActivations);
                    },
                    ( theError) => {
                        throw theError;
                    }
                )
            });
        }












    commitActivations( theApplicationActivations: IApplicationActivation[]): Promise<IApplicationActivation[]> {

        if( !( theApplicationActivations
            && theApplicationActivations.length)) {
            return Promise.resolve( null);
        }

        if( !( this.login)) {
            return Promise.resolve( null);
        }

        return new Promise<IApplicationActivation[]>( (pheResolve, pheReject) => {

            this.storeActivations( theApplicationActivations)
                .then(
                    () => {
                        return this.propagate_activationsChanged();
                    },
                    ( pheError) => {
                        throw pheError;
                    }
                )
                .then(
                    () => {
                        pheResolve( theApplicationActivations);
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }





    storeActivations( theApplicationActivations: IApplicationActivation[]): Promise<IApplicationActivation[]> {
        if( !( theApplicationActivations
            && theApplicationActivations.length)) {
            return Promise.resolve( null);
        }

        if( !( this.login)) {
            return Promise.resolve( null);
        }

        return new Promise<IApplicationActivation[]>( (pheResolve, pheReject) => {

            let aStorageKey = ActivationsProvider.storeKey_applicationActivationsForLogin( this.login);

            this.storage.set( aStorageKey, theApplicationActivations)
                .then(
                    () => {
                        pheResolve( theApplicationActivations);
                    },
                    ( theError) => {
                        pheReject( theError);
                    }
                );
        });
    }









    copyOfApplicationActivations(): IApplicationActivation[] {
        if( !this.applicationActivations) {
            return null;
        }
        if( this.applicationActivations.length < 1) {
            return [];
        }
        return this.applicationActivations.map( ( theApplicationActivation) => {
            return theApplicationActivation.copyWithIdentityActivations();
        });
    }










    static mergeApplicationActivations( theStored: IApplicationActivation[], theInitial: IApplicationActivation[]) {

        if( !( theStored  && theStored.length
               && theInitial && theInitial.length)) {
            return Promise.resolve( theInitial);
        }


        if( ( theStored.length * theInitial.length) > ActivationsProvider.MAXAPPLICATIONACTIVATIONSSQUARE) {
            return ActivationsProvider.mergeApplicationActivations_indexing( theStored, theInitial);
        }

        return ActivationsProvider.mergeApplicationActivations_square( theStored, theInitial);
    }


    static mergeApplicationActivations_indexing( theStored: IApplicationActivation[], theInitial: IApplicationActivation[]) {
        return ActivationsProvider.mergeApplicationActivations_square( theStored, theInitial);
    }


    static mergeApplicationActivations_square( theStored: IApplicationActivation[], theInitial: IApplicationActivation[]) {

        if( !( theStored  && theStored.length
               && theInitial && theInitial.length)) {
            return Promise.resolve( theInitial);
        }

        for( let aStored of theStored) {
            if( !( aStored
                   && aStored.login
                   && aStored.applicationKey)) {
                continue;
            }

            let aFoundInitial: IApplicationActivation = null;
            for( let anInitial of theInitial) {
                if( !( anInitial
                       && anInitial.login
                       && anInitial.applicationKey)) {
                    continue;
                }

                if( !( aStored.login === anInitial.login)) {
                    continue;
                }

                if( anInitial.applicationKey === aStored.applicationKey) {
                    aFoundInitial = anInitial;
                    break
                }
            }
            if( !aFoundInitial) {
                continue;
            }

            aFoundInitial.isActive = aStored.isActive === true;

            if( !( aStored.identityActivations
                   && aStored.identityActivations.length
                   && aFoundInitial.identityActivations
                   && aFoundInitial.identityActivations.length)) {
                continue;
            }

            ActivationsProvider.mergeIdentityActivations_square( aStored.identityActivations, aFoundInitial.identityActivations);
        }
    }


    static mergeIdentityActivations( theStored: IIdentityActivation[], theInitial: IIdentityActivation[]) {

        if( !( theStored  && theStored.length
               && theInitial && theInitial.length)) {
            return Promise.resolve( theInitial);
        }


        if( ( theStored.length * theInitial.length) > ActivationsProvider.MAXIDENTITYACTIVATIONSSQUARE) {
            return ActivationsProvider.mergeIdentityActivations_indexing( theStored, theInitial);
        }

        return ActivationsProvider.mergeIdentityActivations_square( theStored, theInitial);
    }


    static mergeIdentityActivations_indexing( theStored: IIdentityActivation[], theInitial: IIdentityActivation[]) {
        return ActivationsProvider.mergeIdentityActivations_square( theStored, theInitial);
    }


    static mergeIdentityActivations_square( theStored: IIdentityActivation[], theInitial: IIdentityActivation[]) {

        if( !( theStored  && theStored.length
               && theInitial && theInitial.length)) {
            return Promise.resolve( theInitial);
        }

        for( let aStored of theStored) {
            if( !( aStored
                   && aStored.identityKey)) {
                continue;
            }

            let aFoundInitial: IIdentityActivation = null;
            for( let anInitial of theInitial) {
                if( !( anInitial
                       && anInitial.identityKey)) {
                    continue;
                }

                if( anInitial.identityKey === aStored.identityKey) {
                    aFoundInitial = anInitial;
                    break
                }
            }
            if( !aFoundInitial) {
                continue;
            }

            aFoundInitial.isActive = aStored.isActive === true;
        }
    }









    static equalApplicationActivations( theOnes: IApplicationActivation[], theOthers: IApplicationActivation[] ): boolean {
        if( !( theOnes && theOnes.length
               && theOthers && theOthers.length
               && ( theOnes.length === theOthers.length))) {
            return false;
        }

        if( ( theOnes.length * theOthers.length ) > ActivationsProvider.MAXAPPLICATIONACTIVATIONSSQUARE ) {
            return ActivationsProvider.equalApplicationActivations_indexing( theOnes, theOthers );
        }

        return ActivationsProvider.equalApplicationActivations_square( theOnes, theOthers );
    }


    static equalApplicationActivations_indexing( theOnes: IApplicationActivation[], theOthers: IApplicationActivation[] ) : boolean {
        return ActivationsProvider.equalApplicationActivations_square( theOnes, theOthers );
    }


    static equalApplicationActivations_square( theOnes: IApplicationActivation[], theOthers: IApplicationActivation[] ) : boolean {
        if( !( theOnes && theOnes.length
               && theOthers && theOthers.length
               && ( theOnes.length === theOthers.length))) {
            return false;
        }

        for( let aOne of theOnes ) {
            if( !( aOne
                   && aOne.login
                   && aOne.applicationKey ) ) {
                continue;
            }

            let aFoundInitial: IApplicationActivation = null;
            for( let aOther of theOthers ) {
                if( !( aOther
                       && aOther.login
                       && aOther.applicationKey ) ) {
                    continue;
                }

                if( !( aOne.login === aOther.login ) ) {
                    continue;
                }

                if( aOther.applicationKey === aOne.applicationKey ) {
                    aFoundInitial = aOther;
                    break
                }
            }
            if( !aFoundInitial ) {
                continue;
            }

            if( !( aFoundInitial.isActive === aOne.isActive)) {
                return false;
            }

            if( !ActivationsProvider.equalIdentityActivations_square( aOne.identityActivations, aFoundInitial.identityActivations )) {
                return false;
            }
        }

        return true;
    }


    static equalIdentityActivations( theOnes: IIdentityActivation[], theOthers: IIdentityActivation[] ) : boolean {

        if( !( theOnes && theOnes.length
               && theOthers && theOthers.length
               && ( theOnes.length === theOthers.length))) {
            return false;
        }

        if( ( theOnes.length * theOthers.length ) > ActivationsProvider.MAXIDENTITYACTIVATIONSSQUARE ) {
            return ActivationsProvider.equalIdentityActivations_indexing( theOnes, theOthers );
        }

        return ActivationsProvider.equalIdentityActivations_square( theOnes, theOthers );
    }


    static equalIdentityActivations_indexing( theOnes: IIdentityActivation[], theOthers: IIdentityActivation[] ) : boolean {
        return ActivationsProvider.equalIdentityActivations_square( theOnes, theOthers );
    }


    static equalIdentityActivations_square( theOnes: IIdentityActivation[], theOthers: IIdentityActivation[] ) : boolean {

        if( !( theOnes && theOnes.length
               && theOthers && theOthers.length
               && ( theOnes.length === theOthers.length))) {
            return false;
        }

        for( let aOne of theOnes ) {
            if( !( aOne
                   && aOne.identityKey ) ) {
                continue;
            }

            let aFoundInitial: IIdentityActivation = null;
            for( let aOther of theOthers ) {
                if( !( aOther
                       && aOther.identityKey ) ) {
                    continue;
                }

                if( aOther.identityKey === aOne.identityKey ) {
                    aFoundInitial = aOther;
                    break
                }
            }
            if( !aFoundInitial ) {
                continue;
            }

            if( !( aFoundInitial.isActive === aOne.isActive)) {
                return false;
            }
        }

        return true;
    }



}
