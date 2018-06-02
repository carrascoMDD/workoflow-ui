/*
 * flow-applications.ts
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

import {Typed} from "./flow-typed"
import {IApplication, ISpec, IProcessSpec, IGroup, IIdentity, IProcessInitiator} from "./flow-iapplications"


export class Application extends Typed implements IApplication {

    _v_Type = "Application";

    processSpecs: IProcessSpec[];

    specs: ISpec[];
    groups: IGroup[];
    identities: IIdentity[];

    constructor(
        public name: string,
        public key: string,
        public isDisabled : boolean = false) {

        super();

        this.specs      = [ ];
        this.groups     = [ ];
        this.identities = [ ];
    }


    setDisabled( theIsDisabled: boolean) {
        this.isDisabled = theIsDisabled === true;
    }

    getDisabled(): boolean {
        return this.isDisabled === true;
    }

    addProcessSpec( theProcessSpec: IProcessSpec) {
        if ( !theProcessSpec) {
            return;
        }

        this.specs.push( theProcessSpec);
    }


    addGroup( theGroup: IGroup) {
        if ( !theGroup) {
            return;
        }

        this.groups.push( theGroup);
    }



    addIdentity( theIdentity: IIdentity) {
        if ( !theIdentity) {
            return;
        }

        this.identities.push( theIdentity);
    }


    getAllSpecs() : ISpec[] {
        if( !this.specs) {
            return null;
        }
        return this.specs.slice();
    }



    getProcessSpecs() : IProcessSpec[] {
        if( !this.specs) {
            return null;
        }

        const someProcessSpecs : IProcessSpec[] = [ ];
        for( let aSpec of this.specs) {
            if( !aSpec) {
                continue;
            }

            if( !( aSpec._v_Type === "ProcessSpec")) {
                continue;
            }

            someProcessSpecs.push( aSpec);
        }

        return someProcessSpecs;
    }

}





export abstract class Spec extends Typed implements ISpec {

    _v_Type = "Spec";

    constructor(
        public application: IApplication,
        public name: string,
        public key: string) {

        super();
    }
}




export class ProcessSpec extends Spec implements IProcessSpec {

    _v_Type = "ProcessSpec";

    constructor( theApplication: IApplication,
                 theName: string,
                 theKey: string) {

        super( theApplication, theName, theKey);
    }
}




export class ProcessInitiator extends Typed implements IProcessInitiator {

    _v_Type = "ProcessInitiator";

    constructor(
        public initiableProcessKeys: string[],
        public participedProcessKeys: string[]) {

        super();
    };
}



export class Group extends ProcessInitiator implements IGroup {

    _v_Type = "Group";

    constructor(
        public application: IApplication,
        public initiableProcessKeys: string[],
        public participedProcessKeys: string[],
        public name: string,
        public key: string,
        public isVirtual: boolean = false) {

        super( initiableProcessKeys, participedProcessKeys);
    };
}




export class Identity extends ProcessInitiator implements IIdentity {

    _v_Type = "Identity";

    constructor(
        public application: IApplication,
        public initiableProcessKeys: string[],
        public participedProcessKeys: string[],
        public user: string,
        public groupKeys: string[]) {

        super( initiableProcessKeys, participedProcessKeys);
    };
}



