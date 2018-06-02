/*
 * logins-provider.ts
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
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {HttpClient} from '@angular/common/http';

import { ILogin } from "../interfaces/flow-ilogins";
import { Login, LoginApplication } from "../interfaces/flow-logins";


// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_LOGINS_realhost	= "";

const URL_SCHEMEHOSTPORT_samehost = "";
const URL_LOGINS_samehost = "assets/flow/flow-logins-static.json";

const URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
const URL_LOGINS = URL_LOGINS_samehost;



@Injectable()
export class LoginsProvider {

    logins: ILogin[];



    constructor( public httpc: HttpClient) {
        console.log("LoginsProvider constructor");
    }






    getAllLogins(): Observable<ILogin[]> {
        return this.load();
    }






    load(): Observable<ILogin[]> {
        if(this.logins) {
            return Observable.of(this.logins);
        }
        else {
            this.logins = null;
            return this.httpc.get(URL_SCHEMEHOSTPORT + URL_LOGINS).map( this.parseLogins, this);
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





    parseLogins( theSrcLogins: any): ILogin[] {
        console.log(">>> LoginsProvider parseLogins");

        this.logins = [ ];

        if( !theSrcLogins) {
            return;
        }

        for( let aSrcLogin of theSrcLogins) {
            if(aSrcLogin) {

                console.log("    LoginsProvider parseLogins aLogin=" + aSrcLogin.login);

                const aLogin = new Login(
                    aSrcLogin.login,
                    aSrcLogin.name,
                    aSrcLogin.familyName
                );

                if(aSrcLogin.loginApplications) {
                    for(let aSrcLoginApplication of aSrcLogin.loginApplications) {
                        if(!aSrcLoginApplication) {
                            continue;
                        }
                        const aLoginApplication = new LoginApplication(
                            aSrcLoginApplication.applicationKey,
                            this.sliceOrNull( aSrcLoginApplication.identityKeys)
                        );
                        aLogin.addLoginApplication(aLoginApplication);
                    }
                }

                this.logins.push( aLogin);
            }
        }

        console.log("<<< LoginsProvider parseLogins");

        return this.logins;
    }

}
