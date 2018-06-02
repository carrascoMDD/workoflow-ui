/*
 * templates-filter.ts
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
import {Observable} from 'rxjs/Observable';
import {UserData} from '../providers/user-data';
import {ApplicationsProvider} from '../providers/applications-provider';
import {ActiveFilter} from './active-filter';
import {ApplicationKeyed} from './active-filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IApplication } from "../interfaces/flow-iapplications";
import {Templatespec} from "../interfaces/flow-templatespecs";
import {TemplatesProvider} from "../providers/templates-provider";
import {IIdentityActivation} from "../interfaces/flow-iidentityactivation";



@Injectable()
export class TemplatesFilter extends ActiveFilter{

    applications: IApplication[];



    constructor(
        public userData: UserData,
        public applicationsProvider: ApplicationsProvider,
        public templatesProvider: TemplatesProvider) {
        super( userData, applicationsProvider);
        console.log("TemplatesFilter constructor");
    }




    getTemplatespecs( queryText = '' ) : Observable<Templatespec[]> {

        console.log( "TemplatesFilter getTemplatespecs queryText" + queryText);

        return new Observable<Templatespec[]>(( theObserver) => {

            console.log( "TemplatesFilter about to this.templatesProvider.getTemplatespecs().subscribe.\nDelivering after observing templatesProvider, observing applications provide, and .then on applications provider promise is resolved.");

            this.templatesProvider.getTemplatespecs().subscribe(

                ( theTemplatespecs: Templatespec[]) => {
                    console.log( "TemplatesFilter getTemplatespecs received this.templatesProvider.getTemplatespecs().subscribe theTemplatespecs.length=" + ( !theTemplatespecs ? 0 : theTemplatespecs.length));

                    if( !theTemplatespecs || !theTemplatespecs.length) {
                        console.log( "TemplatesFilter no or empty theTemplatespecs from this.templatesProvider.getTemplatespecs().subscribe(");
                        theObserver.next( null);
                        theObserver.complete();
                        return;
                    }
                    console.log( "TemplatesFilter about to this.applicationsProvider.getAllApplications().subscribe");

                    this.getAllApplicationsKeyed().subscribe(
                        ( theApplicationsKeyedMap: Map<string, ApplicationKeyed>) => {
                            console.log( "TemplatesFilter getTemplatespecs received this.getAllApplicationsKeyed().subscribe theApplicationsKeyedMap.length=" + ( !theApplicationsKeyedMap ? 0 : theApplicationsKeyedMap.size));

                            if( !theApplicationsKeyedMap || ( theApplicationsKeyedMap.size < 1))  {
                                console.log( "TemplatesFilter no or empty theApplications from this.getAllApplicationsKeyed().subscribe(");
                                theObserver.next( null);
                                theObserver.complete();
                                return;
                            }

                            console.log( "TemplatesFilter about to  this.userData.getIdentityActivations().then(");

                            this.userData.getIdentityActivations().then(
                                ( theIdentityActivations: IIdentityActivation[]) => {

                                    console.log( "TemplatesFilter getTemplatespecs received this.userData.getIdentityActivations().then(\" theIdentityActivations.length=" + ( !theIdentityActivations ? 0 : theIdentityActivations.length));

                                    if( !theIdentityActivations || !theIdentityActivations.length) {
                                        console.log( "TemplatesFilter no or empty theIdentityActivations from this.userData.getIdentityActivations().then(");
                                        theObserver.next( null);
                                        theObserver.complete();
                                        return;
                                    }

                                    console.log( "TemplatesFilter about to  actually filter templatespecs against initiable or participed processSpecKeys of active identities in applications (according to selectors and loginApplications)");

                                    let someAcceptableProcessSpecs = this.acceptableProcessSpecs( theIdentityActivations);
                                    if( !someAcceptableProcessSpecs) {
                                        console.log( "TemplatesFilter no or empty this.acceptableProcessSpecs(");
                                        theObserver.next( null);
                                        theObserver.complete();
                                        return;
                                    }
                                    const someAcceptableProcessKeys : string[] = [ ];

                                    for( let aProcessSpec of someAcceptableProcessSpecs) {
                                        if( aProcessSpec && aProcessSpec.key) {
                                            if( someAcceptableProcessKeys.indexOf( aProcessSpec.key) < 0) {
                                                someAcceptableProcessKeys.push( aProcessSpec.key);
                                            }
                                        }
                                    }

                                    let someFilteredTemplatespecs : Templatespec[] = [ ];
                                    for( let aTemplatespec of theTemplatespecs) {
                                        if( aTemplatespec && aTemplatespec.key && ( someAcceptableProcessKeys.indexOf( aTemplatespec.key) >= 0)) {
                                            someFilteredTemplatespecs.push( aTemplatespec);
                                        }
                                    }

                                    theObserver.next( someFilteredTemplatespecs);
                                    theObserver.complete();
                                },
                                ( theError: any) => {
                                    theObserver.error( theError);
                                    theObserver.complete();
                                });
                        },
                        ( theError: any) => {
                            console.log( "TemplatesFilter getTemplatespecs theError=" + theError);
                            theObserver.error( theError);
                            theObserver.complete();
                        }
                    );
                },
                ( theError: any) => {
                    console.log( "TemplatesFilter getTemplatespecs theError=" + theError);
                    theObserver.error( theError);
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




}
