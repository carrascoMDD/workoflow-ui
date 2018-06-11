/*
 * templates-provider.ts
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

import {Templatespec, Variablespec} from "../interfaces/flow-templatespecs";

// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_PROCESSDEFINITIONS_realhost	= "/process-api/repository/process-definitions";


const URL_SCHEMEHOSTPORT_samehost = "";
const URL_PROCESSDEFINITIONS_samehost = "assets/flow/flow-templates-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_PROCESSDEFINITIONS = URL_PROCESSDEFINITIONS_samehost;

/*
const URL_PROCESSINSTANCES   	= "/process-api/runtime/process-instances";
const URL_QUERYTASKS 			= "/process-api/query/tasks";
const URL_TASKVARIABLESALL 	= "/process-api/runtime/tasks/{taskId}/variables";
const URL_TASKVARIABLESLOCAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=local";
const URL_TASKVARIABLESGLOBAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=global";
const URL_EXECUTETASKACTION    = "/process-api/runtime/tasks/{taskId}";
*/

@Injectable()
export class TemplatesProvider {

    templatespecs: Templatespec[];

    constructor( public httpc: HttpClient) {
        console.log("TemplatesProvider constructor");
    }




    getTemplatespecs(queryText = ''): Observable<Templatespec[]> {
        console.log("TemplatesProvider getTemplatespecs queryText" + queryText);
        return this.load();
    };



    load(): Observable<Templatespec[]> {
        if (this.templatespecs) {
            return Observable.of(this.templatespecs);
        } else {
            this.templatespecs = null;
            let aURL = URL_SCHEMEHOSTPORT + URL_PROCESSDEFINITIONS;
            return this.httpc.get(aURL).map(this.parseProcessSpec, this);
        }
    }



    parseProcessSpec(theSpecs: any): Templatespec[] {

        this.templatespecs = [];

        if (!theSpecs) {
            return;
        }

        let someProcessSpecs = theSpecs.data;
        if (!someProcessSpecs) {
            return;
        }

        for (let aProcessSpec of someProcessSpecs) {
            if (aProcessSpec) {

                const aTemplatespec: Templatespec = new Templatespec(
                    aProcessSpec.id,
                    aProcessSpec.url,
                    aProcessSpec.key,
                    aProcessSpec.version,
                    aProcessSpec.name,
                    aProcessSpec.description,
                    aProcessSpec.tenantId,
                    aProcessSpec.deploymentId,
                    aProcessSpec.deploymentUrl,
                    aProcessSpec.resource,
                    aProcessSpec.diagramResource,
                    aProcessSpec.category,
                    aProcessSpec.graphicalNotationDefined,
                    aProcessSpec.suspended,
                    aProcessSpec.startFormDefined
                );

                if (aProcessSpec.variables) {
                    for (let aProcessVariable of aProcessSpec.variables) {
                        if (!aProcessVariable) {
                            continue;
                        }
                        const aVariableSpec = new Variablespec(aProcessVariable.name, aProcessVariable.type);
                        aTemplatespec.addVariablespec(aVariableSpec)
                    }
                }


                if (aProcessSpec.transientVariables) {
                    for (let aTransientProcessVariable of aProcessSpec.transientVariables) {
                        if (!aTransientProcessVariable) {
                            continue;
                        }

                        const aVariableSpec = new Variablespec(aTransientProcessVariable.name, aTransientProcessVariable.type);
                        aTemplatespec.addTransientVariablespec(aVariableSpec)
                    }
                }

                this.templatespecs.push(aTemplatespec);
            }
        }

        return this.templatespecs;
    }




    filterTemplate(theTemplatespec: Templatespec, queryWords: string[]) {

        let matchesQueryText = false;
        if (queryWords.length) {
            // of any query word is in the session name than it passes the query test
            queryWords.forEach((queryWord: string) => {
                if ((theTemplatespec.name.toLowerCase().indexOf(queryWord) >= 0)
                    || (theTemplatespec.key.toLowerCase().indexOf(queryWord) >= 0)
                    || (theTemplatespec.description.toLowerCase().indexOf(queryWord) >= 0)) {
                    matchesQueryText = true;
                }
            });
        } else {
            // if there are no query words then this session passes the query test
            matchesQueryText = true;
        }

        // all tests must be true if it should not be hidden
        theTemplatespec.hide = !matchesQueryText;
    }


}
