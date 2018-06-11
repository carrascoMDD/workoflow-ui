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
import {ApplicationsProvider} from '../providers/applications-provider';
import {ActiveFilter} from './active-filter';
import {ApplicationKeyed} from './active-filter';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IApplication } from "../interfaces/flow-iapplications";
import {Templatespec} from "../interfaces/flow-templatespecs";
import {TemplatesProvider} from "../providers/templates-provider";
import {IApplicationActivation} from "../interfaces/flow-iactivations";
import {LoggedinProvider} from "../providers/loggedin-provider";
import {ActivationsProvider} from "../providers/activations-provider";



@Injectable()
export class TemplatesFilter extends ActiveFilter{

    applications: IApplication[];



    constructor(
        theLoggedinProvider: LoggedinProvider,
        theApplicationsProvider: ApplicationsProvider,
        theActivationsProvider: ActivationsProvider,
        public templatesProvider: TemplatesProvider) {

        super( theLoggedinProvider, theApplicationsProvider, theActivationsProvider);

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

                            console.log( "TemplatesFilter about to  this.activationsProvider.getIdentityActivations().then(");

                            this.activationsProvider.retrieveApplicationActivations( null, null).then(
                                ( theApplicationActivations: IApplicationActivation[]) => {

                                    console.log( "TemplatesFilter getTemplatespecs received this.activationsProvider.getIdentityActivations().then( theApplicationActivations.length=" + ( !theApplicationActivations ? 0 : theApplicationActivations.length));

                                    if( !theApplicationActivations || !theApplicationActivations.length) {
                                        console.log( "TemplatesFilter no or empty theApplicationActivations from this.activationsProvider.getIdentityActivations().then(");
                                        theObserver.next( null);
                                        theObserver.complete();
                                        return;
                                    }

                                    console.log( "TemplatesFilter about to  actually filter templatespecs against initiable or participed processSpecKeys of active identities in applications (according to selectors and loginApplications)");

                                    let someAcceptableProcessSpecs = this.acceptableProcessSpecs( theApplicationActivations);
                                    if( !someAcceptableProcessSpecs) {
                                        console.log( "TemplatesFilter no or empty this.acceptableProcessSpecs(");
                                        theObserver.next( null);
                                        theObserver.complete();
                                        return;
                                    }
                                    const someAcceptableProcessKeys = someAcceptableProcessSpecs.map(
                                        (theProcessSpec) => { return theProcessSpec.key;});

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
