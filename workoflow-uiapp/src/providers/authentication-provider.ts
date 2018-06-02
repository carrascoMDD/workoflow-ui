/*
 * authentication-provider.ts
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
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ILogin } from "../interfaces/flow-ilogins";
import { IAuthentication } from "../interfaces/flow-iauthentication";
import {Authentication} from "../interfaces/flow-authentication";



const IGNOREPASSWORD  = true;
const CRASHONERROR    = true;


@Injectable()
export class AuthenticationProvider {

    logins: ILogin[];



    constructor( public httpc: HttpClient) {
        console.log("AuthenticationProvider constructor");
    }




    authenticate( theUsername: string, thePassword: string): Observable<IAuthentication> {

        return new Observable<IAuthentication>(( theObserver) => {

            console.log( "AuthenticationProvider authenticate observable subscribe. Delivering immediately.");

            if( IGNOREPASSWORD || thePassword) {
                setTimeout( () => {
                    theObserver.next( new Authentication( theUsername, true, null, null, null));
                    theObserver.complete();
                }, 16);
            }
            else {
                if( CRASHONERROR) {
                    setTimeout( () => {
                        theObserver.error( new Authentication( theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
                else {
                    setTimeout( () => {
                        theObserver.next( new Authentication( theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
            }

            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe() {
                    console.log( "AuthenticationProvider authenticate observable unsubscribe");
                }
            };
        });
    }




}
