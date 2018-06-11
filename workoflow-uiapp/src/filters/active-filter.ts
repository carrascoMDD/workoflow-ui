/*
 * active-filter.ts
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

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {ApplicationsProvider} from '../providers/applications-provider';

import {IApplication, IProcessSpec} from "../interfaces/flow-iapplications";
import {IApplicationActivation} from "../interfaces/flow-iactivations";
import {IIdentity} from "../interfaces/flow-iapplications";
import {IGroup} from "../interfaces/flow-iapplications";
import {Observable} from "rxjs/Observable";
import {LoggedinProvider} from "../providers/loggedin-provider";
import {ActivationsProvider} from "../providers/activations-provider";




@Injectable()
export abstract class ActiveFilter {

    constructor(
        public loggedinProvider: LoggedinProvider,
        public applicationsProvider: ApplicationsProvider,
        public activationsProvider: ActivationsProvider) {

        console.log("ActiveFilter constructor");
    }

    applicationsKeyed : Map<string, ApplicationKeyed>;



    getAllApplicationsKeyed() : Observable<Map<string, ApplicationKeyed>>  {

        console.log( "ActiveFilter getAllApplicationsKeyed");

        return new Observable<Map<string, ApplicationKeyed>>(( theObserver) => {

            if( this.applicationsKeyed) {
                theObserver.next( this.applicationsKeyed);
                theObserver.complete();
                return;
            }


            this.applicationsProvider.getAllApplications().subscribe(
                (theApplications: IApplication[]) => {
                    console.log("ActiveFilter getAllApplicationsKeyed this.applicationsProvider.getAllApplications().subscribe theApplications.length=" + (!theApplications ? 0 : theApplications.length));

                    if (!theApplications || !theApplications.length) {
                        console.log("TemplatesFilter no or empty theApplications from this.applicationsProvider.getAllApplications().subscribe(");
                        theObserver.next(null);
                        theObserver.complete();
                        return;
                    }

                    this.applicationsKeyed = new Map<string, ApplicationKeyed>();

                    for (let anApplication of theApplications) {
                        if (!anApplication || !anApplication.key) {
                            continue;
                        }
                        this.applicationsKeyed.set( anApplication.key, new ApplicationKeyed(anApplication));
                    }
                    theObserver.next(this.applicationsKeyed);
                    theObserver.complete();
                },

                (theError: any) => {
                    theObserver.error(theError);
                    theObserver.complete();
                }
            );

            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe() {
                    console.log( "TemplatesFilter getTemplatespecs observable unsubscribe");
                }
            };
        });

    }




    acceptableProcessSpecs( theApplicationActivations: IApplicationActivation[]) : IProcessSpec[] {

        if( !( theApplicationActivations
            && theApplicationActivations.length)) {
            return null;
        }

        if( !( this.applicationsKeyed
            && this.applicationsKeyed.size)) {
            return null;
        }


        // Shall collect process keys for each application which has any of them
        const someProcessSpecs : IProcessSpec[] = [ ];

        // Iterate over ApplicationActivations
        for( let anApplicationActivation of theApplicationActivations) {

            if(    !anApplicationActivation
                || !anApplicationActivation.login
                || !anApplicationActivation.applicationKey
                || !( anApplicationActivation.isActive === true)) {
                continue;
            }

            // Nothing more to do if no identityActivations
            if( !( anApplicationActivation.identityActivations
                && anApplicationActivation.identityActivations.length)) {

            }

            // Lookup an application by its key.
            let anApplicationKeyed = this.applicationsKeyed.get( anApplicationActivation.applicationKey);
            if( !anApplicationKeyed) {
                // Login's LoginApplications refer to an unknown application key
                continue;
            }

            // Acceptable process keys for the application shall be among the ones from process specs in the application
            if( !anApplicationKeyed.processpecsByKey || !anApplicationKeyed.processpecsByKey.size) {
                // The application refered by the IdentityActivation does not hold any process specs
                continue;
            }

            if( !anApplicationKeyed.identitiesByKey) {
                // The application refered by the IdentityActivation does not hold any identities
                continue;
            }


            // Iterate over Identity Activations
            for( let anIdentityActivation of anApplicationActivation.identityActivations) {
                if(    !anIdentityActivation
                    || !anIdentityActivation.identityKey
                    || !( anIdentityActivation.isActive === true)) {
                    continue;
                }


                let anIdentityByKey = anApplicationKeyed.identitiesByKey.get( anIdentityActivation.identityKey);
                if( !anIdentityByKey) {
                    // The application refered by the IdentityActivation does not hold the identity refered by its key from the identity activation
                    continue;
                }

                // Collect ProcessSpecs with keys as refered by the identity initiableProcessKeys
                if( anIdentityByKey.initiableProcessKeys) {
                    this.processSpecsByKeyInto( anApplicationKeyed, anIdentityByKey.initiableProcessKeys, someProcessSpecs);
                }

                // Collect ProcessSpecs with keys as refered by the identity participedProcessKeys
                if( anIdentityByKey.participedProcessKeys) {
                    this.processSpecsByKeyInto( anApplicationKeyed, anIdentityByKey.participedProcessKeys, someProcessSpecs);
                }

                // Collect ProcessSpecs from each of the groups refered by the identity group keys
                if( anIdentityByKey.groupKeys) {
                    for( let aGroupKey of anIdentityByKey.groupKeys) {
                        if( !aGroupKey) {
                            continue;
                        }

                        let aGroup = anApplicationKeyed.groupsByKey.get( aGroupKey);
                        if( !aGroup) {
                            continue;
                        }

                        // Collect ProcessSpecs with keys as refered by the group initiableProcessKeys
                        if( aGroup.initiableProcessKeys) {
                            this.processSpecsByKeyInto( anApplicationKeyed, aGroup.initiableProcessKeys, someProcessSpecs);
                        }

                        // Collect ProcessSpecs with keys as refered by the group participedProcessKeys
                        if( aGroup.participedProcessKeys) {
                            this.processSpecsByKeyInto( anApplicationKeyed, aGroup.participedProcessKeys, someProcessSpecs);
                        }
                    }
                }
            }
        }

        return someProcessSpecs;
    }




    processSpecsByKeyInto(
        theApplicationKeyed: ApplicationKeyed,
        theProcessKeys: string[],
        theProcessSpecs: IProcessSpec[]) {

        if( !theApplicationKeyed) {
            return;
        }

        if( !theProcessKeys || !theProcessKeys.length) {
            return;
        }

        if( !theProcessSpecs) {
            return;
        }

        for( let aProcessKey of theProcessKeys) {
            if( !aProcessKey) {
                continue;
            }

            let aProcessSpec = theApplicationKeyed.processpecsByKey.get( aProcessKey);
            if( aProcessSpec) {
                if( theProcessSpecs.indexOf( aProcessSpec) < 0) {
                    theProcessSpecs.push( aProcessSpec);
                }
            }
        }
    }



}





export class ApplicationKeyed {

    identitiesByKey:    Map<string, IIdentity>;
    groupsByKey:        Map<string, IGroup>;
    processpecsByKey:   Map<string, IProcessSpec>;

    constructor( public application: IApplication) {

        this.identitiesByKey  = new Map<string, IIdentity>();
        this.groupsByKey      = new Map<string, IGroup>();
        this.processpecsByKey = new Map<string, IProcessSpec>();

        this.initFromApplication();
    }



    initFromApplication()  {
        if( !this.application) {
            return;
        }

        let someSpecs = this.application.getProcessSpecs();
        if( someSpecs) {
            for( let aProcessSpec of someSpecs) {
                if( !aProcessSpec || !aProcessSpec.key) {
                    continue;
                }

                this.processpecsByKey.set( aProcessSpec.key, aProcessSpec);
            }
        }

        if( this.application.identities) {
            for( let anIdentity of this.application.identities) {
                if( !anIdentity || !anIdentity.user) {
                    continue;
                }

                this.identitiesByKey.set( anIdentity.user, anIdentity);
            }
        }

        if( this.application.groups) {
            for( let aGroup of this.application.groups) {
                if( !aGroup || !aGroup.key) {
                    continue;
                }

                this.groupsByKey.set( aGroup.key, aGroup);
            }
        }
    }


}
