/*
 * inbox.ts
 *
 * Created @author Antonio Carrasco Valero 201806012216
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

import {Component} from '@angular/core';

import {LoggedinPage} from "../loggedin/loggedin";

@Component({
    selector: 'flow-header',
    templateUrl: 'flow-header.html'
})
export class FlowHeader {

    flowpage: LoggedinPage;

    constructor() {
        console.log("FlowHeader constructor");
    }


    setFlowPage( theLoggedinPage: LoggedinPage) {
        this.flowpage = theLoggedinPage;
    }

    getFlowPage(): LoggedinPage{
        return this.flowpage;
    }

}
