/*
 * flow-logins.ts
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

import { Typed } from "./flow-typed"
import {ILogin, ILoginApplication} from "./flow-ilogins"


export class Login extends Typed  implements ILogin {

    _v_Type = "Login";

    loginApplications: ILoginApplication[];

    constructor(
        public login: string,
        public name: string,
        public familyName: string) {

        super();
        this.loginApplications = [];
    };

    addLoginApplication( theLoginApplication: ILoginApplication) {
        if ( !theLoginApplication) {
            return;
        }

        this.loginApplications.push( theLoginApplication);
    }
}




export class LoginApplication implements ILoginApplication {

    _v_Type = "LoginApplication";

    constructor(
        public applicationKey: string,
        public identityKeys: string[] ) {
        console.log( "LoginApplication applicationKey=" + applicationKey, " identityKeys=" + identityKeys.toString())
    };
}
