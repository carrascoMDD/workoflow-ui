/*
 * applications-provider.ts
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

import {HttpClient} from '@angular/common/http';


import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { IApplication } from "../interfaces/flow-iapplications";
import {Application, Group, Identity, ProcessSpec} from "../interfaces/flow-applications";


// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_APPLICATIONS_realhost	= "";

const URL_SCHEMEHOSTPORT_samehost = "";
const URL_APPLICATIONS_samehost = "assets/flow/flow-applications-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_APPLICATIONS = URL_APPLICATIONS_samehost;




@Injectable()
export class ApplicationsProvider {

    applications: IApplication[];



    constructor( public httpc: HttpClient) {
        console.log("ApplicationsProvider constructor");
    }



    getAllApplications(): Observable<IApplication[]> {
        return this.load();
    }



    load(): Observable<IApplication[]> {
        if(this.applications) {
            return Observable.of(this.applications);
        } else {
            this.applications = null;
            return  this.httpc.get(URL_SCHEMEHOSTPORT + URL_APPLICATIONS).map( this.parseApplications, this);
        }
    }





    sliceOrNull( theStrings: string[]) : string[] {
        if( !theStrings) {
            return null;
        }

        if( typeof theStrings === "undefined") {
            return null;
        }

        if( !( typeof theStrings.length === "number")) {
            return null;
        }

        if( !theStrings.length) {
            return [];
        }

        return theStrings.slice();
    }






    parseApplications( theSrcApplications: any): IApplication[] {
        console.log(">>> ApplicationsProvider parseApplications");

        this.applications = [ ];

        if( !theSrcApplications) {
            return;
        }

        for( let aSrcApplication of theSrcApplications) {
            if(aSrcApplication && ( aSrcApplication._v_Type === "Application")) {

                const anApplication = new Application(
                    aSrcApplication.name,
                    aSrcApplication.key
                );

                if(aSrcApplication.processSpecs) {
                    for(let aSrcProcessSpec of aSrcApplication.processSpecs) {
                        if(!aSrcProcessSpec) {
                            continue;
                        }
                        const aProcessSpec = new ProcessSpec(
                            anApplication,
                            aSrcProcessSpec.name,
                            aSrcProcessSpec.key
                        );
                        anApplication.addProcessSpec(aProcessSpec);
                    }
                }


                if(aSrcApplication.groups) {
                    for(let aSrcGroup of aSrcApplication.groups) {
                        if(!aSrcGroup) {
                            continue;
                        }
                        const aGroup = new Group(
                            anApplication,
                            this.sliceOrNull( aSrcGroup.initiableProcessKeys),
                            this.sliceOrNull( aSrcGroup.participedProcessKeys),
                            aSrcGroup.name,
                            aSrcGroup.key
                        );
                        anApplication.addGroup(aGroup);
                    }
                }

                if(aSrcApplication.identities) {
                    for(let aSrcIdentity of aSrcApplication.identities) {
                        if(!aSrcIdentity) {
                            continue;
                        }
                        const anIdentity = new Identity(
                            anApplication,
                            this.sliceOrNull( aSrcIdentity.initiableProcessKeys),
                            this.sliceOrNull( aSrcIdentity.participedProcessKeys),
                            aSrcIdentity.user,
                            this.sliceOrNull( aSrcIdentity.groups)
                        );
                        anApplication.addIdentity(anIdentity);
                    }
                }

                this.applications.push( anApplication);
            }
        }

        console.log("<<< ApplicationsProvider parseApplications");

        return this.applications;
    }


}
