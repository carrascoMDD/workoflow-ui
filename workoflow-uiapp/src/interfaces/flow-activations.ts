/*
 * flow-activations.ts
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
import {IActivable} from "./flow-iactivations"
import {IApplicationActivation} from "./flow-iactivations"
import {IIdentityActivation} from "./flow-iactivations"



export class Activable extends Typed implements IActivable {

    _v_Type = "Activable";

    constructor(
        public isActive: boolean = false) {

        super();
    };


    setActive( theIsActive: boolean) {
        this.isActive = theIsActive === true;
    }


    getActive(): boolean {
        return this.isActive === true;
    }

}






export class ApplicationActivation extends Activable implements IApplicationActivation {

    _v_Type = "ApplicationActivation";

    identityActivations: IIdentityActivation[];


    constructor(
        theLogin:          string,
        theApplicationKey: string,
        theIsActive:       boolean);

    constructor(
        theLogin:          string,
        theApplicationKey: string,
        theIsActive:       boolean,
        theStored?:        any);

    constructor(
        public login:          string,
        public applicationKey: string,
        theIsActive:           boolean = false,
        theStored?:            any) {

        super( theIsActive);

        this.identityActivations = [ ];

        if( theStored) {
            this.initFromStored( theStored);
        }
    };


    getLogin(): string {
        return this.login;
    }



    addIdentityActivation( theIdentityActivation: IIdentityActivation) {
        if ( !theIdentityActivation) {
            return;
        }

        this.identityActivations.push( theIdentityActivation);
    }



    copyWithIdentityActivations(): IApplicationActivation {
        const aCopy = new ApplicationActivation( this.login, this.applicationKey, this.isActive);
        if( this.identityActivations) {
            for( let anIdentityActivation of this.identityActivations) {
                anIdentityActivation.copyIntoApplicationActivation(  aCopy);
            }
        }
        return aCopy;
    }



    initFromStored( theStored: any) {
        if( !( theStored
            && theStored.identityActivations)) {
            return;
        }

        for( let aMayBeIdentityActivation of theStored) {
            if( !( aMayBeIdentityActivation
                && aMayBeIdentityActivation.identityKey)) {
                continue;
            }

            this.addIdentityActivation(
                new IdentityActivation(
                    this,
                    aMayBeIdentityActivation.identityKey,
                    aMayBeIdentityActivation.isActive === true
                )
            );

        }
    }



    copyAsStored(): any {
        if( !(this.login && this.applicationKey)) {
            return null;
        }
        const someIdentityActivations = [ ];

        const aCopyApplicationActivation = {
            "login": this.login,
            "applicationKey":  this.applicationKey,
            "isActive": this.isActive === true,
            "identityActivations": someIdentityActivations
        };

        if( this.identityActivations && this.identityActivations.length) {
            for( let anIdentityActivation of this.identityActivations) {
                if( !anIdentityActivation) {
                    continue;
                }

                someIdentityActivations.push( anIdentityActivation.copyAsStored());
            }
        }

        return aCopyApplicationActivation;
    }


}








export class IdentityActivation extends Activable implements IIdentityActivation {

    _v_Type = "IdentityActivation";

    constructor(
        public applicationActivation: IApplicationActivation,
        public identityKey: string,
        theIsActive: boolean = false) {

        super( theIsActive);
    };



    getLogin(): string {
        if( !this.applicationActivation) {
            return null;
        }
        return this.applicationActivation.getLogin();
    }



    copyIntoApplicationActivation( theApplicationActivation: IApplicationActivation): IdentityActivation {
        if( !theApplicationActivation) {
            return null;
        }
        const aCopy = new IdentityActivation( theApplicationActivation, this.identityKey, this.isActive);
        theApplicationActivation.addIdentityActivation( aCopy);
    }



    copyAsStored(): any {
        if( !( this.applicationActivation
            && this.identityKey)) {
            return null;
        }

        return {
            "identityKey":  this.identityKey,
            "isActive": !!this.isActive
        };

    }


}
