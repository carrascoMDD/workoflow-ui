/*
 * flow-templatespecs.ts
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

import {ITemplatespec, IVariablespec, IVariableType} from "./flow-itemplatespecs"

export class Templatespec implements ITemplatespec {

  public hide : Boolean;

  constructor(
    public id: string,
    public url: string,
    public key: string,
    public version: number,
    public name: string,
    public description: string,
    public tenantId: string,
    public deploymentId: string,
    public deploymentUrl: string,
    public resource: string,
    public diagramResource: string,
    public category: string,
    public graphicalNotationDefined: boolean,
    public suspended: boolean,
    public startFormDefined: boolean
  ) {
    this.variables          = [];
    this.transientVariables = [];
    this.hide = false;
  };

  variables: IVariablespec[];
  transientVariables: IVariablespec[];

  addVariablespec( theVariableSpec : IVariablespec) {
    if( !theVariableSpec) {
      return;
    }

    this.variables.push( theVariableSpec);
  }

  addTransientVariablespec( theVariableSpec : IVariablespec) {
    if( !theVariableSpec) {
      return;
    }

    this.transientVariables.push( theVariableSpec);
  }

}



export class Variablespec implements IVariablespec {

  constructor( public name: string, public type: IVariableType) {};

}

